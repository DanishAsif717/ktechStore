using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


namespace ktechStore.Infrastructure.Repositories
{
    public class OrderGroupRepository : IOrderGroupRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderGroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(OrderGroup orderGroup)
        {
            await _context.OrderGroups.AddAsync(orderGroup);
            await _context.SaveChangesAsync();
        }

        public async Task<OrderGroup?> GetByIdAsync(int id)
        {
            return await _context.OrderGroups
                .Include(og => og.Orders)
                    .ThenInclude(o => o.OrderItems)
                .FirstOrDefaultAsync(og => og.Id == id);
        }

        public async Task UpdateAsync(OrderGroup orderGroup)
        {
            _context.OrderGroups.Update(orderGroup);
            await _context.SaveChangesAsync();
        }
    }
}
