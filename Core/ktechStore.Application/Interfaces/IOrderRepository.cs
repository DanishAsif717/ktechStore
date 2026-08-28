using ktechStore.Core.Entities;
namespace ktechStore.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetOrdersByVendorAsync(int vendorId);
    }
}
