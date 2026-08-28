using ktechStore.Application.Interfaces;
using ktechStore.Application.Services;
using ktechStore.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NToastNotify;

namespace AspnetCoreMvcFull.Areas.Vendor.Controllers
{
  [Area("Vendor")]
  [Authorize(Roles = "Vendor")]
  public class OrdersController : Controller
  {
    private readonly IOrderService _orderService;   
    private readonly IVendorRepository _vendorRepo;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IToastNotification _toastNotification;

    public OrdersController(
        IOrderService orderService,         
        IVendorRepository vendorRepo,        
        UserManager<ApplicationUser> userManager,
        IToastNotification toastNotification)
    {
      _orderService = orderService;         
      _vendorRepo = vendorRepo;             
      _userManager = userManager;
      _toastNotification = toastNotification;
    }
    private async Task<ktechStore.Core.Entities.Vendor?> GetCurrentVendorAsync()
    {
      var userId = _userManager.GetUserId(User);
      return await _vendorRepo.GetByApplicationUserIdAsync(userId!);
    }

    public async Task<IActionResult> Index()
    {
      var vendor = await GetCurrentVendorAsync();
      if (vendor == null) return NotFound("Vendor profile not found.");

      var orders = await _orderService.GetOrdersByVendorAsync(vendor.Id);
      return View(orders);
    }
  }
}
