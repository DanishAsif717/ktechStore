using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NToastNotify;

namespace AspnetCoreMvcFull.Areas.Vendor.Controllers
{
  [Area("Vendor")]
  [Authorize(Roles = "Admin")]
  public class VendorRequestsController : Controller
  {
    private readonly IVendorService _vendorService;
    private readonly IToastNotification _toastNotification;

    public VendorRequestsController(IVendorService vendorService, IToastNotification toastNotification)
    {
      _vendorService = vendorService;
      _toastNotification = toastNotification;
    }

    // GET: Vendor/VendorRequests
    public async Task<IActionResult> Index()
    {
      var applications = await _vendorService.GetAllApplicationsAsync();
      return View(applications);
    }

    // POST: Vendor/VendorRequests/Approve/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Approve(int id)
    {
      try
      {
        var result = await _vendorService.ApproveApplicationAsync(id, User.Identity?.Name ?? "Admin");
        TempData["GeneratedPassword"] = result.GeneratedPassword;
        TempData["GeneratedEmail"] = result.Email;
        _toastNotification.AddSuccessToastMessage("Vendor approved successfully!");
      }
      catch (Exception ex)
      {
        _toastNotification.AddErrorToastMessage(ex.Message);
      }

      return RedirectToAction(nameof(Index));
    }

    // POST: Vendor/VendorRequests/Reject/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Reject(int id)
    {
      try
      {
        await _vendorService.RejectApplicationAsync(id, User.Identity?.Name ?? "Admin");
        _toastNotification.AddSuccessToastMessage("Application rejected.");
      }
      catch (Exception ex)
      {
        _toastNotification.AddErrorToastMessage(ex.Message);
      }

      return RedirectToAction(nameof(Index));
    }
  }
}
