using ktechStore.Application.DTOs;

namespace ktechStore.Application.Interfaces
{
    public interface ICategoryRequestService
    {
        Task SubmitRequestAsync(CategoryRequestCreateDto dto, int vendorId);
        Task<IEnumerable<CategoryRequestListDto>> GetAllAsync();
        Task<IEnumerable<CategoryRequestListDto>> GetByVendorAsync(int vendorId);
        Task ApproveAsync(int requestId, string reviewedBy);
        Task RejectAsync(int requestId, string reviewedBy);
    }
}
