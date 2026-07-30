using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


namespace ktechStore.Infrastructure.Repositories
{
    public class CategoryRequestRepository : ICategoryRequestRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRequestRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(CategoryRequest request)
        {
            await _context.CategoryRequests.AddAsync(request);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<CategoryRequest>> GetAllAsync()
        {
            return await _context.CategoryRequests
                .Include(cr => cr.RequestedByVendor)
                .OrderByDescending(cr => cr.RequestedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CategoryRequest>> GetByVendorIdAsync(int vendorId)
        {
            return await _context.CategoryRequests
                .Where(cr => cr.RequestedByVendorId == vendorId)
                .OrderByDescending(cr => cr.RequestedAt)
                .ToListAsync();
        }

        public async Task<CategoryRequest?> GetByIdAsync(int id)
        {
            return await _context.CategoryRequests.FindAsync(id);
        }

        public async Task UpdateAsync(CategoryRequest request)
        {
            _context.CategoryRequests.Update(request);
            await _context.SaveChangesAsync();
        }
    }
}
