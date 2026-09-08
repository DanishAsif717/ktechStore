using ktechStore.Application.DTOs;
using ktechStore.Core.Enums;

namespace ktechStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductUpsertDto?> GetProductForEditAsync(int id);
        Task CreateProductAsync(ProductUpsertDto dto, string user, int? vendorId = null);
        Task UpdateProductAsync(ProductUpsertDto dto, string user);
        Task DeleteProductAsync(int id);
        Task<string> GenerateUniqueSkuAsync(string productName, string categoryName);
        Task<IEnumerable<ProductDto>> GetProductsByVendorAsync(int vendorId);
        Task<bool> IsProductOwnedByVendorAsync(int productId, int vendorId);
        Task<List<PendingProductDto>> GetPendingProductsAsync();
        Task<bool> ApproveProductAsync(int productId);
        Task<bool> RejectProductAsync(int productId, string? reason);
        Task<int> CountApprovalsProductsAsync();
    }
}
