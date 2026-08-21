using ktechStore.Core.Entities;
using ktechStore.Core.Enums;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ktechStore.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> SkuExistsAsync(string sku);
        Task<IEnumerable<Product>> GetByVendorIdAsync(int vendorId);
        Task<List<Product>> GetByStatusAsync(ProductStatus status);


    }
}
