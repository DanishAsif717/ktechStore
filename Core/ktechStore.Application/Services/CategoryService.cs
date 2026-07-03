using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            // Business logic: Direct repo se data mango aur return karo
            return await _categoryRepo.GetAllAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _categoryRepo.GetByIdAsync(id);
        }

        public async Task CreateCategoryAsync(Category category)
        {
            await _categoryRepo.AddAsync(category);
            await _categoryRepo.SaveChangesAsync();
        }

        public async Task UpdateCategoryAsync(Category category)
        {
            _categoryRepo.Update(category);
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