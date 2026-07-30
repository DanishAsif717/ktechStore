using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Core.Interfaces;
using NToastNotify;

namespace AspnetCoreMvcFull.Areas.Vendor.Controllers
{
  [Area("Vendor")]
  [Authorize(Roles = "Vendor")]
  public class ProductsController : Controller
  {
    private readonly IProductService _productService;
    private readonly ICategoryService _categoryService;
    private readonly IVendorRepository _vendorRepo;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IToastNotification _toastNotification;

    public ProductsController(
        IProductService productService,
        ICategoryService categoryService,
        IVendorRepository vendorRepo,
        UserManager<ApplicationUser> userManager,
        IToastNotification toastNotification)
    {
      _productService = productService;
      _categoryService = categoryService;
      _vendorRepo = vendorRepo;
      _userManager = userManager;
      _toastNotification = toastNotification;
    }

    // 🔥 Har action me current Vendor nikalne ka helper
    private async Task<ktechStore.Core.Entities.Vendor?> GetCurrentVendorAsync()
    {
      var userId = _userManager.GetUserId(User);
      return await _vendorRepo.GetByApplicationUserIdAsync(userId!);
    }

    // GET: Vendor/Products
    public async Task<IActionResult> Index()
    {
      var vendor = await GetCurrentVendorAsync();
      if (vendor == null) return NotFound("Vendor profile not found.");

      var products = await _productService.GetProductsByVendorAsync(vendor.Id);
      return View(products);
    }

    // GET: Vendor/Products/Create
    public async Task<IActionResult> Create()
    {
      var categories = await _categoryService.GetAllCategoriesAsync();
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name");
      return View(new ProductUpsertDto());
    }

    // POST: Vendor/Products/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ProductUpsertDto dto)
    {
      var vendor = await GetCurrentVendorAsync();
      if (vendor == null) return NotFound("Vendor profile not found.");

      if (ModelState.IsValid)
      {
        await _productService.CreateProductAsync(dto, User.Identity?.Name ?? "Vendor", vendor.Id);
        _toastNotification.AddSuccessToastMessage("Product created");
        return RedirectToAction(nameof(Index));
      }

      var categories = await _categoryService.GetAllCategoriesAsync();
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name", dto.CategoryId);
      return View(dto);
    }

    // GET: Vendor/Products/Edit/5
    public async Task<IActionResult> Edit(int id)
    {
      var vendor = await GetCurrentVendorAsync();
      if (vendor == null) return NotFound("Vendor profile not found.");

      // 🔥 OWNERSHIP CHECK — sabse zaroori security step
      var isOwned = await _productService.IsProductOwnedByVendorAsync(id, vendor.Id);
      if (!isOwned) return Forbid();

      var dto = await _productService.GetProductForEditAsync(id);
      if (dto == null) return NotFound();

      var categories = await _categoryService.GetAllCategoriesAsync();
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name", dto.CategoryId);
      return View(dto);
    }

    // POST: Vendor/Products/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, ProductUpsertDto dto)
    {
      if (id != dto.Id) return NotFound();

      var vendor = await GetCurrentVendorAsync();
      if (vendor == null) return NotFound("Vendor profile not found.");

      // 🔥 OWNERSHIP CHECK
      var isOwned = await _productService.IsProductOwnedByVendorAsync(id, vendor.Id);
      if (!isOwned) return Forbid();

      if (ModelState.IsValid)
      {
        await _productService.UpdateProductAsync(dto, User.Identity?.Name ?? "Vendor");
        _toastNotification.AddSuccessToastMessage("Product updated");
        return RedirectToAction(nameof(Index));
      }

      var categories = await _categoryService.GetAllCategoriesAsync();
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name", dto.CategoryId);
      return View(dto);
    }

    // GET: Vendor/Products/Delete/5
    public async Task<IActionResult> Delete(int id)
    {
      var vendor = await GetCurrentVendorAsync();
      if (vendor == null) return NotFound("Vendor profile not found.");

      var isOwned = await _productService.IsProductOwnedByVendorAsync(id, vendor.Id);
      if (!isOwned) return Forbid();

      var product = await _productService.GetProductByIdAsync(id);
      if (product == null) return NotFound();

      return View(product);
    }

    // POST: Vendor/Products/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
      var vendor = await GetCurrentVendorAsync();
      if (vendor == null) return NotFound("Vendor profile not found.");

      var isOwned = await _productService.IsProductOwnedByVendorAsync(id, vendor.Id);
      if (!isOwned) return Forbid();

      await _productService.DeleteProductAsync(id);
      _toastNotification.AddSuccessToastMessage("Product deleted");
      return RedirectToAction(nameof(Index));
    }
  }
}
