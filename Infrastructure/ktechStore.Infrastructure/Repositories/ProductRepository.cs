using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Core.Enums;
using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ktechStore.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductDetails)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductDetails)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Products.AnyAsync(e => e.Id == id);
        }
        public async Task<bool> SkuExistsAsync(string sku)
        {
            return await _context.Products.AnyAsync(p => p.SKU == sku);
        }
        public async Task<IEnumerable<Product>> GetByVendorIdAsync(int vendorId)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductDetails)
                .Where(p => p.VendorId == vendorId)
                .ToListAsync();
        }

        public async Task<List<Product>> GetByStatusAsync(ProductStatus status)
        {
            return await _context.Products
                .Where(p => p.Status == status)
                .Include(p => p.Vendor)
                .Include(p => p.Category)
                .ToListAsync();
        }



    }
}
