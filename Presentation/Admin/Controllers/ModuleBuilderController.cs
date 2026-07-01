using AspnetCoreMvcFull.Models;
using ktechStore.Core.Entities;
using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AspnetCoreMvcFull.Controllers
{
  public class ModuleBuilderController : Controller
  {
    private readonly IModuleService _moduleService;
    private readonly ApplicationDbContext _db; // ADD KARO

    public ModuleBuilderController(IModuleService moduleService, ApplicationDbContext db)
    {
      _moduleService = moduleService;
      _db = db; // ADD KARO
    }

    public async Task<IActionResult> Index() =>
        View(await _moduleService.GetAllAsync());

    public async Task<IActionResult> Create()
    {
      var existingModules = await _moduleService.GetAllAsync();

      ViewBag.ExistingTables = existingModules.Select(m => m.TableName).ToList();

      return View();
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateModuleViewModel vm)
    {
      if (!ModelState.IsValid)
      {
        return View(vm);
      }

      try
      {
        var module = new ModuleDefinition
        {
          ModuleName = vm.ModuleName,
          TableName = vm.TableName.ToLower()
        };

        var fields = vm.Fields.Select((f, i) => new ModuleField
        {
          FieldName = f.FieldName,
          FieldType = f.FieldType,
          IsRequired = f.IsRequired,
          DisplayOrder = i,
          IsForeignKey = f.IsForeignKey,
          RelatedTable = f.RelatedTable
        }).ToList();

        await _moduleService.CreateModuleAsync(module, fields);

        TempData["SuccessMessage"] = "Module and Table created successfully!";
        return RedirectToAction("Index");
      }
      catch (Exception ex)
      {
      
        ModelState.AddModelError(string.Empty, ex.Message);

        return View(vm);
      }
    }

    public async Task<IActionResult> Records(int id)
    {
      var module = await _moduleService.GetByIdAsync(id);
      var records = new List<Dictionary<string, object>>();

      var selectColumns = new List<string> { $"m.\"Id\" AS \"id\"" };
      var joinClauses = new List<string>();

      var allModules = await _db.ModuleDefinitions.Include(m => m.Fields).ToListAsync();

      foreach (var field in module.Fields.OrderBy(f => f.DisplayOrder))
      {
        if (field.FieldType == "Relation" && !string.IsNullOrEmpty(field.RelatedTable))
        {
          var targetTableClean = field.RelatedTable.Trim().ToLower();
          var alias = $"t_{field.FieldName.Trim().ToLower()}";

          var targetModule = allModules.FirstOrDefault(m => m.TableName.ToLower() == targetTableClean);

          var displayColumn = targetModule?.Fields?
              .OrderBy(f => f.DisplayOrder)
              .FirstOrDefault(f => f.FieldType == "Text")?.FieldName;

          if (!string.IsNullOrEmpty(displayColumn))
          {
            selectColumns.Add($"{alias}.\"{displayColumn}\" AS \"{field.FieldName}_text\"");
          }
          else
          {
            selectColumns.Add($"{alias}.\"Id\" AS \"{field.FieldName}_text\"");
          }

          selectColumns.Add($"m.\"{field.FieldName}\" AS \"{field.FieldName}\"");

          joinClauses.Add($"LEFT JOIN \"{targetTableClean}\" AS {alias} ON m.\"{field.FieldName}\" = {alias}.\"Id\"");
        }
        else
        {
          selectColumns.Add($"m.\"{field.FieldName}\"");
        }
      }

      // Mukammal Query banana
      var columnsSql = string.Join(", ", selectColumns);
      var joinsSql = string.Join(" ", joinClauses);
      var finalSql = $"SELECT {columnsSql} FROM \"{module.TableName}\" AS m {joinsSql}";

      // 2. DATABASE EXECUTION
      var connectionString = _db.Database.GetConnectionString();
      await using var conn = new Npgsql.NpgsqlConnection(connectionString);
      await conn.OpenAsync();

      await using var cmd = conn.CreateCommand();
      cmd.CommandText = finalSql;

      await using var reader = await cmd.ExecuteReaderAsync();
      while (await reader.ReadAsync())
      {
        var row = new Dictionary<string, object>();
        for (int i = 0; i < reader.FieldCount; i++)
        {
          var value = reader.GetValue(i);
          row[reader.GetName(i)] = value == DBNull.Value ? null : value;
        }
        records.Add(row);
      }

      ViewBag.Module = module;
      ViewBag.Records = records;
      return View();
    }

    public async Task<IActionResult> Delete(int id)
    {
      await _moduleService.DeleteAsync(id);
      return RedirectToAction("Index");
    }


    // ===== CREATE RECORD =====
    public async Task<IActionResult> CreateRecord(int id)
    {
      var module = await _moduleService.GetByIdAsync(id);
      var allModules = await _db.ModuleDefinitions.Include(m => m.Fields).ToListAsync();

      var relationData = new Dictionary<string, List<Dictionary<string, object>>>();

      var connectionString = _db.Database.GetConnectionString();
      await using var conn = new Npgsql.NpgsqlConnection(connectionString);
      await conn.OpenAsync();

      foreach (var field in module.Fields)
      {
        if (field.FieldType == "Relation" && !string.IsNullOrEmpty(field.RelatedTable))
        {
          var targetTable = field.RelatedTable.Trim().ToLower();
          var targetModule = allModules.FirstOrDefault(m => m.TableName.ToLower() == targetTable);

          // Target table ka text column dhoondte hain display karne ke liye
          var displayColumn = targetModule?.Fields?
              .OrderBy(f => f.DisplayOrder)
              .FirstOrDefault(f => f.FieldType == "Text")?.FieldName;

          // Agar koi text column na mile, to fallback to "Id"
          displayColumn = !string.IsNullOrEmpty(displayColumn) ? $"\"{displayColumn}\"" : "\"Id\"";

          var items = new List<Dictionary<string, object>>();
          try
          {
            await using var cmd = conn.CreateCommand();
            // Query: SELECT "Id", "Name" FROM "category"
            cmd.CommandText = $"SELECT \"Id\", {displayColumn} FROM \"{targetTable}\"";

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
              var item = new Dictionary<string, object>
                    {
                        { "Id", reader.GetValue(0) },
                        { "Text", reader.GetValue(1) }
                    };
              items.Add(item);
            }
          }
          catch (Exception)
          {
            // Target table agar empty ho ya na mile to crash na ho
          }

          relationData[field.FieldName] = items;
        }
      }

      ViewBag.Module = module;
      ViewBag.RelationData = relationData; // Dropdown data sent to View
      return View();
    }

    [HttpPost]
    public async Task<IActionResult> CreateRecord(int id, IFormCollection form)
    {
      var module = await _moduleService.GetByIdAsync(id);

      var columns = string.Join(", ", module.Fields.Select(f => $"\"{f.FieldName}\""));
      var values = string.Join(", ", module.Fields.Select(f => $"'{form[f.FieldName]}'"));

      var sql = $"INSERT INTO {module.TableName} ({columns}) VALUES ({values})";
      await _db.Database.ExecuteSqlRawAsync(sql);

      return RedirectToAction("Records", new { id });
    }

    // ===== EDIT RECORD =====
    public async Task<IActionResult> EditRecord(int id, int recordId)
    {
      var module = await _moduleService.GetByIdAsync(id);
      var record = new Dictionary<string, object>();

      var connectionString = _db.Database.GetConnectionString();
      await using var conn = new Npgsql.NpgsqlConnection(connectionString);
      await conn.OpenAsync();

      await using var cmd = conn.CreateCommand();
      cmd.CommandText = $"SELECT * FROM {module.TableName} WHERE \"Id\" = {recordId}";

      await using var reader = await cmd.ExecuteReaderAsync();
      if (await reader.ReadAsync())
        for (int i = 0; i < reader.FieldCount; i++)
          record[reader.GetName(i)] = reader.GetValue(i);

      ViewBag.Module = module;
      ViewBag.Record = record;
      return View();
    }

    [HttpPost]
    public async Task<IActionResult> EditRecord(int id, int recordId, IFormCollection form)
    {
      var module = await _moduleService.GetByIdAsync(id);

      var updates = string.Join(", ", module.Fields.Select(f => $"\"{f.FieldName}\" = '{form[f.FieldName]}'"));
      var sql = $"UPDATE {module.TableName} SET {updates} WHERE \"Id\" = {recordId}";
      await _db.Database.ExecuteSqlRawAsync(sql);

      return RedirectToAction("Records", new { id });
    }

    // ===== DELETE RECORD =====
    public async Task<IActionResult> DeleteRecord(int id, int recordId)
    {
      var module = await _moduleService.GetByIdAsync(id);
      var sql = $"DELETE FROM {module.TableName} WHERE \"Id\" = {recordId}";
      await _db.Database.ExecuteSqlRawAsync(sql);
      return RedirectToAction("Records", new { id });
    }
  }
}
