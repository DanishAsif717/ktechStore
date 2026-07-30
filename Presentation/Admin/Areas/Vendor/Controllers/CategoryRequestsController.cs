using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NToastNotify;

namespace AspnetCoreMvcFull.Areas.Vendor.Controllers
{
  [Area("Vendor")]
  [Authorize(Roles = "Vendor")]
  public class CategoryRequestsController : Controller
  {
    private readonly ICategoryRequestService _categoryRequestService;
    private readonly IVendorRepository _vendorRepo;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IToastNotification _toastNotification;

    public CategoryRequestsController(
        ICategoryRequestService categoryRequestService,
        IVendorRepository vendorRepo,
        UserManager<ApplicationUser> userManager,
        IToastNotification toastNotification)
    {
      _categoryRequestService = categoryRequestService;
      _vendorRepo = vendorRepo;
      _userManager = userManager;
      _toastNotification = toastNotification;
    }

    public async Task<IActionResult> Index()
    {
      var userId = _userManager.GetUserId(User);
      var vendor = await _vendorRepo.GetByApplicationUserIdAsync(userId!);
      if (vendor == null) return NotFound();

      var requests = await _categoryRequestService.GetByVendorAsync(vendor.Id);
      return View(requests);
    }

    public IActionResult Create()
    {
      return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CategoryRequestCreateDto dto)
    {
      var userId = _userManager.GetUserId(User);
      var vendor = await _vendorRepo.GetByApplicationUserIdAsync(userId!);
      if (vendor == null) return NotFound();

      if (ModelState.IsValid)
      {
        await _categoryRequestService.SubmitRequestAsync(dto, vendor.Id);
        _toastNotification.AddSuccessToastMessage("Category request submitted");
        return RedirectToAction(nameof(Index));
      }

      return View(dto);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Approve(int id)
    {
      try
      {
        await _categoryRequestService.ApproveAsync(id, User.Identity?.Name ?? "Admin");
        _toastNotification.AddSuccessToastMessage("Category approved and created");
      }
      catch (Exception ex)
      {
        _toastNotification.AddErrorToastMessage(ex.Message);
      }
      return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Reject(int id)
    {
      try
      {
        await _categoryRequestService.RejectAsync(id, User.Identity?.Name ?? "Admin");
        _toastNotification.AddSuccessToastMessage("Category request rejected");
      }
      catch (Exception ex)
      {
        _toastNotification.AddErrorToastMessage(ex.Message);
      }
      return RedirectToAction(nameof(Index));
    }

  }

}
