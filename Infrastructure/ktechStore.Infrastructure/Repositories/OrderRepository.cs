using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ktechStore.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetOrdersByVendorAsync(int vendorId)
        {
            return await _context.Orders
                .Where(o => o.VendorId == vendorId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
    }
}
