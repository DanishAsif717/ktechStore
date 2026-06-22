using ktechStore.Core.Entities;
using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 

namespace AspnetCoreMvcFull.Controllers
{
  public class CategoriesController : Controller
  {

    // DB Context constructor injection ke zariye load ho raha hy
    private readonly ICategoryService _categoryRepo;

    public CategoriesController(ICategoryService categoryRepo)
    {
      _categoryRepo = categoryRepo;
    }

    // GET: Categories
    public async Task<IActionResult> Index()
    {
      var categories = await _categoryRepo.GetAllAsync();
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
    public ActionResult Create(IFormCollection collection)
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
