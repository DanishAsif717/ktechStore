using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using NToastNotify;
using System.Threading.Tasks;

namespace AspnetCoreMvcFull.Areas.Catalog.Controllers
{


  [Area("Catalog")]
  public class ProductsController : Controller
  {
    private readonly IProductService _productService;
    private readonly ICategoryService _categoryService;
    private readonly IMistralService _mistralService;
    private readonly IToastNotification _toastNotification;

    public ProductsController(
      IProductService productService,
      ICategoryService categoryService,
      IMistralService mistralService,
      IToastNotification toastNotification

    )
    {
      _productService = productService;
      _categoryService = categoryService;
      _mistralService = mistralService;
      _toastNotification = toastNotification;
    }


    //  Product Descrption Generation Endpoint

    [HttpPost]
    public async Task<IActionResult> GenerateDescription([FromBody] DescriptionRequestDto request)
    {
      if (string.IsNullOrEmpty(request.ProductName))
        return BadRequest("Product name is required.");

      // Prompts define karein
      string systemPrompt = "You are an e-commerce copywriter. Write a compelling product description under 250 characters max. Do not use markdown, formatting, or quotation marks.";
      string userPrompt = $"Product Name: {request.ProductName}, Category: {request.CategoryName}. Generate a description focused on user benefits.";

      // Service call karein
      string aiDescription = await _mistralService.GenerateDescriptionAsync(systemPrompt, userPrompt);

      return Json(new { success = true, description = aiDescription });
    }

    //  SKU Generation Endpoint
    [HttpPost]
    public async Task<IActionResult> GenerateSku([FromBody] DescriptionRequestDto dto)
    {
      if (dto == null || string.IsNullOrEmpty(dto.ProductName))
      {
        return Json(new { success = false, message = "Product name is required to build SKU." });
      }

      try
      {
        var sku = await _productService.GenerateUniqueSkuAsync(dto.ProductName, dto.CategoryName);
        return Json(new { success = true, sku });
      }
      catch (Exception ex)
      {
        return Json(new { success = false, message = ex.Message });
      }
    }
    // GET: Catalog/Products
    public async Task<IActionResult> Index()
    {
      var products = await _productService.GetAllProductsAsync();
      return View(products);
    }

    // GET: Catalog/Products/Details/5
    public async Task<IActionResult> Details(int id)
    {
      var product = await _productService.GetProductByIdAsync(id);
      if (product == null) return NotFound();

      return View(product);
    }

    // GET: Catalog/Products/Create
    public async Task<IActionResult> Create()
    {
      var categories = await _categoryService.GetAllCategoriesAsync(); 
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name");
      return View(new ProductUpsertDto());
    }

    // POST: Catalog/Products/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ProductUpsertDto dto)
    {
      if (ModelState.IsValid)
      {
        await _productService.CreateProductAsync(dto, User.Identity?.Name ?? "Admin");
        return RedirectToAction(nameof(Index));
      }

      var categories = await _categoryService.GetAllCategoriesAsync();
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name", dto.CategoryId);
      return View(dto);
    }

    // GET: Catalog/Products/Edit/5
    public async Task<IActionResult> Edit(int id)
    {
      var dto = await _productService.GetProductForEditAsync(id);
      if (dto == null) return NotFound();

      var categories = await _categoryService.GetAllCategoriesAsync();
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name", dto.CategoryId);
      return View(dto);
    }

    // POST: Catalog/Products/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, ProductUpsertDto dto)
    {
      if (id != dto.Id) return NotFound();

      if (ModelState.IsValid)
      {
        await _productService.UpdateProductAsync(dto, User.Identity?.Name ?? "Admin");
        return RedirectToAction(nameof(Index));
      }

      var categories = await _categoryService.GetAllCategoriesAsync();
      ViewData["CategoryId"] = new SelectList(categories, "Id", "Name", dto.CategoryId);
      return View(dto);
    }

    // GET: Catalog/Products/Delete/5
    public async Task<IActionResult> Delete(int id)
    {
      var product = await _productService.GetProductByIdAsync(id);
      if (product == null) return NotFound();

      return View(product);
    }

    // POST: Catalog/Products/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
      await _productService.DeleteProductAsync(id);
      return RedirectToAction(nameof(Index));
    }

    // GET: /Catalog/Products/Approvals
    public async Task<IActionResult> Approvals()
    {
      var pendingProducts = await _productService.GetPendingProductsAsync();
      return View(pendingProducts);
    }
    // POST: Approve
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Approve(int id)
    {
      var result = await _productService.ApproveProductAsync(id);
      if (!result)
      {
        _toastNotification.AddErrorToastMessage("Product not found or already processed.");
        return RedirectToAction(nameof(Approvals));
      }

      _toastNotification.AddSuccessToastMessage("Product approved successfully.");
      return RedirectToAction(nameof(Approvals));
    }

    // POST: Reject
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Reject(int id, string? reason)
    {
      var result = await _productService.RejectProductAsync(id,  reason);
      if (!result)
      {
        _toastNotification.AddErrorToastMessage("Product not found or already processed.");
        return RedirectToAction(nameof(Approvals));
      }

      _toastNotification.AddSuccessToastMessage("Product rejected.");
      return RedirectToAction(nameof(Approvals));
    }

  }
}
