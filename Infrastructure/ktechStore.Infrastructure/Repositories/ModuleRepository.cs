using ktechStore.Core.Entities;
using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ktechStore.Infrastructure.Repositories
{
    public class ModuleRepository : IModuleService
    {
        private readonly ApplicationDbContext _db;
        public ModuleRepository(ApplicationDbContext db) => _db = db;

        public async Task<List<ModuleDefinition>> GetAllAsync() =>
            await _db.ModuleDefinitions.Include(m => m.Fields).ToListAsync();

        public async Task<ModuleDefinition> GetByIdAsync(int id) =>
            await _db.ModuleDefinitions.Include(m => m.Fields)
                .FirstOrDefaultAsync(m => m.Id == id);

        public async Task CreateModuleAsync(ModuleDefinition module, List<ModuleField> fields)
        {
            var tableNameClean = module.TableName.Trim().ToLower();

            // 1. DUPLICATE CHECK
            var exists = await _db.ModuleDefinitions.AnyAsync(m => m.TableName.ToLower() == tableNameClean);
            if (exists)
            {
                throw new Exception($"A table or module with the name '{module.TableName}' already exists.");
            }

            // 2. TRANSACTION START
            using var transaction = await _db.Database.BeginTransactionAsync();

            try
            {
                // A. Blueprint save karo
                module.TableName = tableNameClean;
                module.Fields = fields;
                module.CreatedAt = DateTime.UtcNow;
                _db.ModuleDefinitions.Add(module);
                await _db.SaveChangesAsync();

                // B. Columns taiyar karo
                var columns = fields.Select(f =>
                {
                    string type;
                    string fkConstraint = "";

                    if (f.FieldType == "Relation" && !string.IsNullOrEmpty(f.RelatedTable))
                    {
                        type = "INTEGER";
                        fkConstraint = $@" REFERENCES ""{f.RelatedTable.Trim().ToLower()}"" (""Id"") ON DELETE CASCADE";
                    }
                    else
                    {
                        type = f.FieldType switch
                        {
                            "Text" => "VARCHAR(255)",
                            "Number" => "INTEGER",
                            "Boolean" => "BOOLEAN",
                            "Date" => "TIMESTAMP",
                            "Email" => "VARCHAR(255)",
                            "TextArea" => "TEXT",
                            _ => "VARCHAR(255)"
                        };
                    }

                    var required = f.IsRequired ? "NOT NULL" : "";

                    return $@"""{f.FieldName.Trim()}"" {type} {required}{fkConstraint}";
                });

                // C. Actual table banao
                var sql = $@"CREATE TABLE ""{tableNameClean}"" (
                    ""Id"" SERIAL PRIMARY KEY,
                    {string.Join(",\n", columns)}
                )";

                await _db.Database.ExecuteSqlRawAsync(sql);

                // D. COMMIT
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                // E. ROLLBACK
                await transaction.RollbackAsync();
                throw new Exception($"Failed to create module. Database error: {ex.Message}", ex);
            }
        }

        public async Task DeleteAsync(int id)
        {
            var module = await GetByIdAsync(id);
            if (module != null)
            {
                using var transaction = await _db.Database.BeginTransactionAsync();
                try
                {
                    var tableNameClean = module.TableName.Trim().ToLower();

                    var sql = $@"DROP TABLE IF EXISTS ""{tableNameClean}""";
                    await _db.Database.ExecuteSqlRawAsync(sql);

                    _db.ModuleDefinitions.Remove(module);
                    await _db.SaveChangesAsync();

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception($"Table delete nahi ho saki. Error: {ex.Message}", ex);
                }
            }
        }

        // ==========================================
        // FIX: Implemented missing interface member
        // ==========================================
        public async Task<List<Dictionary<string, object>>> GetRecordsAsync(int moduleId)
        {
            // 1. Pehle module definition check karein taake table ka naam mil sake
            var module = await GetByIdAsync(moduleId);
            if (module == null)
            {
                throw new Exception("Module not found.");
            }

            var tableName = module.TableName.Trim().ToLower();
            var records = new List<Dictionary<string, object>>();

            // 2. Dynamic SQL query execute karke data fetch karein
            using (var command = _db.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = $@"SELECT * FROM ""{tableName}""";

                if (command.Connection.State != System.Data.ConnectionState.Open)
                    await command.Connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.GetValue(i);
                        }
                        records.Add(row);
                    }
                }
            }

            return records;
        }
    }
}