using ktechStore.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Core.Interfaces
{
    public interface IModuleService
    {
        Task<List<ModuleDefinition>> GetAllAsync();
        Task<ModuleDefinition> GetByIdAsync(int id);
        Task CreateModuleAsync(ModuleDefinition module, List<ModuleField> fields);
        Task DeleteAsync(int id);
        Task<List<Dictionary<string, object>>> GetRecordsAsync(int moduleId);
        //Task<Dictionary<string, List<Dictionary<string, object>>>> GetRelationDataAsync(ModuleDefinition module);
        //Task CreateRecordAsync(ModuleDefinition module, IFormCollection form);
        //Task<Dictionary<string, object>> GetRecordByIdAsync(ModuleDefinition module, int recordId);
        //Task UpdateRecordAsync(ModuleDefinition module, int recordId, IFormCollection form);
        //Task DeleteRecordAsync(ModuleDefinition module, int recordId);
    }
}
