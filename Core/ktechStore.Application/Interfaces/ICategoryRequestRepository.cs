using ktechStore.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.Interfaces
{
    public interface ICategoryRequestRepository
    {
        Task AddAsync(CategoryRequest request);
        Task<IEnumerable<CategoryRequest>> GetAllAsync();
        Task<IEnumerable<CategoryRequest>> GetByVendorIdAsync(int vendorId);
        Task<CategoryRequest?> GetByIdAsync(int id);
        Task UpdateAsync(CategoryRequest request);
    }
}
