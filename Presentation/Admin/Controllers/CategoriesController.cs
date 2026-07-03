using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ktechStore.Core.Entities;
using ktechStore.Application.Interfaces; // <-- 1. Naya sahi namespace jahan ICategoryService majood hy

namespace AspnetCoreMvcFull.Controllers
{
  public class CategoriesController : Controller
  {
    // 2. Service ka sahi injection aur clean variable name
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
      _categoryService = categoryService;
    }

    // GET: Categories
    public async Task<IActionResult> Index()
    {
      // Naye Application layer ke function ka naam use kiya
      var categories = await _categoryService.GetAllCategoriesAsync();
      return View(categories);
    }

    // GET: CategoriesController/Details/5
    public ActionResult Details(int id)
    {
      return View();
    }

    // GET: CategoriesController/Create
    public ActionResult Create()
    {
      return View();
    }

    // POST: CategoriesController/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Category category)
    {
      if (!ModelState.IsValid) return View(category);

      try
      {
        // Service khud hi add bhi karegi aur SaveChanges b chalayegi (jo humne CategoryService mein likha tha)
        await _categoryService.CreateCategoryAsync(category);

        TempData["SuccessMessage"] = "Category created successfully!";
        return RedirectToAction(nameof(Index));
      }
      catch (Exception ex)
      {
        TempData["ErrorMessage"] = "An error occurred: " + ex.Message;
      }

      return View(category);
    }

    // GET: CategoriesController/Edit/5
    public ActionResult Edit(int id)
    {
      return View();
    }

    // POST: CategoriesController/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Edit(int id, IFormCollection collection)
    {
      try
      {
        return RedirectToAction(nameof(Index));
      }
      catch
      {
        return View();
      }
    }

    // GET: CategoriesController/Delete/5
    public ActionResult Delete(int id)
    {
      return View();
    }

    // POST: CategoriesController/Delete/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Delete(int id, IFormCollection collection)
    {
      try
      {
        return RedirectToAction(nameof(Index));
      }
      catch
      {
        return View();
      }
    }
  }
}
