using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AspnetCoreMvcFull.Areas.Vendor.Controllers
{
  [Area("Vendor")]
  [Authorize(Roles = "Vendor")]
  public class DashboardController : Controller
  {
    private readonly IVendorRepository _vendorRepo;
    private readonly IProductService _productService;
    private readonly UserManager<ApplicationUser> _userManager;

    public DashboardController(
        IVendorRepository vendorRepo,
        IProductService productService,
        UserManager<ApplicationUser> userManager)
    {
      _vendorRepo = vendorRepo;
      _productService = productService;
      _userManager = userManager;
    }

    public async Task<IActionResult> Index()
    {
      var userId = _userManager.GetUserId(User);
      var vendor = await _vendorRepo.GetByApplicationUserIdAsync(userId!);

      if (vendor == null) return NotFound("Vendor profile not found.");

      var products = await _productService.GetProductsByVendorAsync(vendor.Id);

      ViewBag.ShopName = vendor.ShopName;
      ViewBag.TotalProducts = products.Count();
      ViewBag.TotalStock = products.Sum(p => p.Stock);

      return View();
    }
  }
}
