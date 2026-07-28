using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ktechStore.Web.Controllers.Api
{
    [Route("api/vendor-applications")]
    [ApiController]
    public class VendorApplicationsApiController : ControllerBase
    {
        private readonly IVendorService _vendorService;

        public VendorApplicationsApiController(IVendorService vendorService)
        {
            _vendorService = vendorService;
        }
        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] VendorApplicationDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _vendorService.SubmitApplicationAsync(dto);
                return Ok(new { success = true, message = "Application submitted successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { success = false, message = ex.Message });
            }
        }
    }
}
