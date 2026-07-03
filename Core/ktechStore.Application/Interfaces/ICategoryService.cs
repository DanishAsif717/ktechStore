using ktechStore.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using ktechStore.Application.DTOs;

namespace ktechStore.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
        Task CreateCategoryAsync(CategoryCreateDto category);
        Task UpdateCategoryAsync(int id, CategoryCreateDto dto);
        Task DeleteCategoryAsync(int id);
    }
}