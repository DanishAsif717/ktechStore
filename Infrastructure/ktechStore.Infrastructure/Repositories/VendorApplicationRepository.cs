using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ktechStore.Infrastructure.Repositories
{
    public class VendorApplicationRepository : IVendorApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public VendorApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(VendorApplication application)
        {
            await _context.VendorApplications.AddAsync(application);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.VendorApplications
                .AnyAsync(a => a.Email == email && a.Status != Core.Enums.VendorStatus.Rejected);
        }
        public async Task<IEnumerable<VendorApplication>> GetAllAsync()
        {
            return await _context.VendorApplications
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();
        }

        public async Task<VendorApplication?> GetByIdAsync(int id)
        {
            return await _context.VendorApplications.FindAsync(id);
        }

        public async Task UpdateAsync(VendorApplication application)
        {
            _context.VendorApplications.Update(application);
            await _context.SaveChangesAsync();
        }

    }
}
