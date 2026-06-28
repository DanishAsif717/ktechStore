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
    }
}
