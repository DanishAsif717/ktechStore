using ktechStore.Core.Entities;

namespace ktechStore.Application.Interfaces
{
    public interface IVendorApplicationRepository
    {
        Task AddAsync(VendorApplication application);
        Task<bool> EmailExistsAsync(string email);
        Task<IEnumerable<VendorApplication>> GetAllAsync();
        Task<VendorApplication?> GetByIdAsync(int id);
        Task UpdateAsync(VendorApplication application);
        //Task<int> GetPendingVendorCountAsync();
    }
}
