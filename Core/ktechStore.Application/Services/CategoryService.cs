using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using ktechStore.Application.DTOs;
using System.Linq;

namespace ktechStore.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepo;

        // Constructor ke zariye humne Repository (Kitchen Helper) ko andar bulaya
        public CategoryService(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepo.GetAllAsync();

            // LINQ .Select use karke har single Entity ko CategoryDto mein map kiya
            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Status = c.Status, // Enum map ho raha hy
                CreatedAt = c.CreatedAt
            }).ToList();
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category == null) return null;

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                CreatedAt = category.CreatedAt
            };
        }

        public async Task CreateCategoryAsync(CategoryCreateDto dto)
        {
            var categoryEntity = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow // System ne khud time lagaya
            };

            await _categoryRepo.AddAsync(categoryEntity);
            await _categoryRepo.SaveChangesAsync();
        }

        public async Task UpdateCategoryAsync(int id, CategoryCreateDto dto)
        {
            var existingCategory = await _categoryRepo.GetByIdAsync(id);
            if (existingCategory == null) return;

            // Purani entity ki values naye data se update keen
            existingCategory.Name = dto.Name;
            existingCategory.Description = dto.Description;
            existingCategory.Status = dto.Status;

            _categoryRepo.Update(existingCategory);
            await _categoryRepo.SaveChangesAsync();
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category != null)
            {
                _categoryRepo.Delete(category);
                await _categoryRepo.SaveChangesAsync();
            }
        }
    }
}