using ktechStore.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

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
