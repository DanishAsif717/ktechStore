using ktechStore.Application.DTOs;


namespace ktechStore.Application.Interfaces
{
    public interface IVendorService
    {
        Task SubmitApplicationAsync(VendorApplicationDto dto);
        Task<IEnumerable<VendorApplicationListDto>> GetAllApplicationsAsync();
        Task<VendorApprovalResultDto> ApproveApplicationAsync(int applicationId, string reviewedBy);
        Task RejectApplicationAsync(int applicationId, string reviewedBy);
    }
}
