using System.Collections.Generic;
using System.Threading.Tasks;
using ktechStore.Application.DTOs;

namespace ktechStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductUpsertDto?> GetProductForEditAsync(int id);
        Task CreateProductAsync(ProductUpsertDto dto, string user);
        Task UpdateProductAsync(ProductUpsertDto dto, string user);
        Task DeleteProductAsync(int id);

    }
}
