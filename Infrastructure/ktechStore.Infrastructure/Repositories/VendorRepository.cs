using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


namespace ktechStore.Infrastructure.Repositories
{
    public class VendorRepository : IVendorRepository
    {
        private readonly ApplicationDbContext _context;

        public VendorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Vendor vendor)
        {
            await _context.Vendors.AddAsync(vendor);
            await _context.SaveChangesAsync();
        }
        public async Task<Vendor?> GetByApplicationUserIdAsync(string applicationUserId)
        {
            return await _context.Vendors
                .FirstOrDefaultAsync(v => v.ApplicationUserId == applicationUserId);
        }

        public async Task<Vendor?> GetByIdAsync(int id)
        {
            return await _context.Vendors.FindAsync(id);
        }
    }
}
