using ktechStore.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Core.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task AddAsync(Category category);
        void Update(Category category);
        void Delete(Category category);
        Task<bool> SaveChangesAsync();
    }
}
