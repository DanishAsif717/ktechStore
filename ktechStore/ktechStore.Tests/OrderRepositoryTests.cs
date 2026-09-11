using ktechStore.Core.Entities;
using Microsoft.EntityFrameworkCore;
using ktechStore.Infrastructure.Persistence;
using ktechStore.Infrastructure.Repositories;

namespace ktechStore.Tests
{
    public class OrderRepositoryTests
    {
        private ApplicationDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetOrderDetailsAsync_ReturnsOrder_WhenOrderBelongsToVendor()
        {
            // Arrange
            var context = GetInMemoryContext();

            context.Orders.Add(new Order { Id = 1, VendorId = 5 });
            context.Orders.Add(new Order { Id = 2, VendorId = 9 });
            await context.SaveChangesAsync();

            var repo = new OrderRepository(context);

            // Act
            var result = await repo.GetOrderDetailsAsync(1, 5);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task GetOrderDetailsAsync_ReturnsNull_WhenOrderBelongsToDifferentVendor()
        {
            // Arrange
            var context = GetInMemoryContext();

            context.Orders.Add(new Order { Id = 1, VendorId = 5 });
            await context.SaveChangesAsync();

            var repo = new OrderRepository(context);

            // Act
            var result = await repo.GetOrderDetailsAsync(1, 9);

            // Assert
            Assert.Null(result);
        }

    }
}
