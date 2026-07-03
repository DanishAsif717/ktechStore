using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ktechStore.Application.DTOs;

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
    public async Task<IActionResult> Create(CategoryCreateDto dto)
    {
      if (ModelState.IsValid)
      {
        // Service ko direct DTO bhej diya, mapping woh khud andar karegi
        await _categoryService.CreateCategoryAsync(dto);
        return RedirectToAction(nameof(Index));
      }
      return View(dto);
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
