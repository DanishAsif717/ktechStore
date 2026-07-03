using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ktechStore.Core.Entities;
using ktechStore.Application.Interfaces; // <-- Naya namespace takay service mil sakay

namespace AspnetCoreMvcFull.Areas.Catalog.Controllers
{
  [Area("Catalog")]
  public class CategoriesController : Controller
  {
    // 1. DbContext ko hata kar Service ka interface lagaya
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
      _categoryService = categoryService;
    }

    // GET: Catalog/Categories
    public async Task<IActionResult> Index()
    {
      // Direct service se data manga
      var categories = await _categoryService.GetAllCategoriesAsync();
      return View(categories);
    }

    // GET: Catalog/Categories/Details/5
    public async Task<IActionResult> Details(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var category = await _categoryService.GetCategoryByIdAsync(id.Value);
      if (category == null)
      {
        return NotFound();
      }

      return View(category);
    }

    // GET: Catalog/Categories/Create
    public IActionResult Create()
    {
      return View();
    }

    // POST: Catalog/Categories/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Name,Description,IsActive,CreatedAt")] Category category)
    {
      if (ModelState.IsValid)
      {
        // Service ko bola ke create karo (woh khud hi save b karegi)
        await _categoryService.CreateCategoryAsync(category);
        return RedirectToAction(nameof(Index));
      }
      return View(category);
    }

    // GET: Catalog/Categories/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var category = await _categoryService.GetCategoryByIdAsync(id.Value);
      if (category == null)
      {
        return NotFound();
      }
      return View(category);
    }

    // POST: Catalog/Categories/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description,IsActive,CreatedAt")] Category category)
    {
      if (id != category.Id)
      {
        return NotFound();
      }

      if (ModelState.IsValid)
      {
        try
        {
          await _categoryService.UpdateCategoryAsync(category);
        }
        catch
        {
          if (await _categoryService.GetCategoryByIdAsync(id) == null)
          {
            return NotFound();
          }
          else
          {
            throw;
          }
        }
        return RedirectToAction(nameof(Index));
      }
      return View(category);
    }

    // GET: Catalog/Categories/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var category = await _categoryService.GetCategoryByIdAsync(id.Value);
      if (category == null)
      {
        return NotFound();
      }

      return View(category);
    }

    // POST: Catalog/Categories/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
      await _categoryService.DeleteCategoryAsync(id);
      return RedirectToAction(nameof(Index));
    }
  }
}
