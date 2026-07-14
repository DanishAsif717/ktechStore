using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ktechStore.Core.Entities;
using ktechStore.Application.Interfaces;
using ktechStore.Application.DTOs;
using NToastNotify;
namespace AspnetCoreMvcFull.Areas.Catalog.Controllers
{
  [Area("Catalog")]
  public class CategoriesController : Controller
  {
    // 1. DbContext ko hata kar Service ka interface lagaya
    private readonly ICategoryService _categoryService;
    private readonly IToastNotification _toastNotification;   // 👈 add karo

    public CategoriesController(ICategoryService categoryService, IToastNotification toastNotification)
    {
      _categoryService = categoryService;
      _toastNotification = toastNotification;
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
    public async Task<IActionResult> Create(CategoryCreateDto dto)
    {
      if (ModelState.IsValid)
      {
        try
        {
          await _categoryService.CreateCategoryAsync(dto);
          _toastNotification.AddSuccessToastMessage("Category created");

          return RedirectToAction(nameof(Index));
        }
        catch
        {
          _toastNotification.AddErrorToastMessage("Something went wrong");
          return View(dto);
        }
      }
      return View(dto);
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
      var dto = new CategoryCreateDto
      {
        Name = category.Name,
        Description = category.Description,
        Status = category.Status
      };

      return View(dto);
    }

    // POST: Catalog/Categories/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, CategoryCreateDto dto)
    {
      
      if (ModelState.IsValid)
      {
        try
        {
          await _categoryService.UpdateCategoryAsync(id, dto);
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
        _toastNotification.AddSuccessToastMessage("Category updated");

        return RedirectToAction(nameof(Index));
      }
      return View(dto);
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
      try
      {
        await _categoryService.DeleteCategoryAsync(id);
        _toastNotification.AddSuccessToastMessage("Category deleted");
      }
      catch
      {
        _toastNotification.AddErrorToastMessage("Something went wrong");
      }
      return RedirectToAction(nameof(Index));
    }
  }
}
