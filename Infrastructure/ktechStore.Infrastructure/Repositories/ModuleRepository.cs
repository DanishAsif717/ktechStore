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

            // 1. DUPLICATE CHECK: Pehle hi check karlo ke is naam ka module ya table pehle se to nahi hy
            var exists = await _db.ModuleDefinitions.AnyAsync(m => m.TableName.ToLower() == tableNameClean);
            if (exists)
            {
                // Agar pehle se hy to yahin se exception throw kardo taake agla code chale hi na
                throw new Exception($"A table or module with the name '{module.TableName}' already exists.");
            }

            // 2. TRANSACTION START: Yahan se Rollback ka setup shuru hota hy
            using var transaction = await _db.Database.BeginTransactionAsync();

            try
            {
                // A. Blueprint save karo
                module.TableName = tableNameClean; // Saaf suthra naam save karein
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

                    // Yahan fkConstraint ko sql string ke sath jor diya
                    return $@"""{f.FieldName.Trim()}"" {type} {required}{fkConstraint}";
                });

                // C. Actual table banao (With Double Quotes for Reserved Keywords like 'order')
                var sql = $@"CREATE TABLE ""{tableNameClean}"" (
                    ""Id"" SERIAL PRIMARY KEY,
                    {string.Join(",\n", columns)}
                )";

                await _db.Database.ExecuteSqlRawAsync(sql);

                // D. COMMIT: Agar dono kaam bina kisi error ke hogaye, to database ko pakka (save) kardo
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                // E. ROLLBACK: Agar table banane mein 'order' jaisa koi bhi error aaya, 
                // to upar jo Blueprint save hua tha, woh bhi database se delete (Rollback) ho jayega!
                await transaction.RollbackAsync();

                // Error ko aage bhej do taake Controller ko pata chale aur woh user ko dikha sake
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
                    // Table ka naam saaf karein aur lowercase karein
                    var tableNameClean = module.TableName.Trim().ToLower();

                    var sql = $@"DROP TABLE IF EXISTS ""{tableNameClean}""";
                    await _db.Database.ExecuteSqlRawAsync(sql);

                    // Blueprint database record delete karein
                    _db.ModuleDefinitions.Remove(module);
                    await _db.SaveChangesAsync();

                    // Transaction pakki karein
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // Agar koi masla aaye to rollback karein
                    await transaction.RollbackAsync();
                    throw new Exception($"Table delete nahi ho saki. Error: {ex.Message}", ex);
                }
            }
        }
    }
}
