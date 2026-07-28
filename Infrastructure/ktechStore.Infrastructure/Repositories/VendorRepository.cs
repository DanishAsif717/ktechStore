using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Text;

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
    }
}
