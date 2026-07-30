using ktechStore.Core.Entities;

namespace ktechStore.Application.Interfaces
{
    public interface IVendorRepository
    {
        Task AddAsync(Vendor vendor);
        Task<Vendor?> GetByApplicationUserIdAsync(string applicationUserId);
        Task<Vendor?> GetByIdAsync(int id);
    }
}
