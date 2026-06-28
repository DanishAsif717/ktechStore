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

    public IActionResult Create() => View();

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
          //IsForeignKey = f.IsForeignKey, 
          //RelatedTable = f.RelatedTable
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

      var connectionString = _db.Database.GetConnectionString();
      await using var conn = new Npgsql.NpgsqlConnection(connectionString);
      await conn.OpenAsync();

      await using var cmd = conn.CreateCommand();
      cmd.CommandText = $"SELECT * FROM {module.TableName}";

      await using var reader = await cmd.ExecuteReaderAsync();
      while (await reader.ReadAsync())
      {
        var row = new Dictionary<string, object>();
        for (int i = 0; i < reader.FieldCount; i++)
          row[reader.GetName(i)] = reader.GetValue(i);
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
      ViewBag.Module = module;
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
