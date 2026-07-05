using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;

namespace AspnetCoreMvcFull.Areas.Catalog.Controllers
{
  [Area("Catalog")]
  public class ProductsController : Controller
  {
    private readonly IProductService _productService;
    private readonly ICategoryService _categoryService; // Category dropdowns ke liye

    public ProductsController(IProductService productService, ICategoryService categoryService)
    {
      _productService = productService;
      _categoryService = categoryService;
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
      var categories = await _categoryService.GetAllCategoriesAsync(); // Assuming this method exists in your CategoryService
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
  }
}
