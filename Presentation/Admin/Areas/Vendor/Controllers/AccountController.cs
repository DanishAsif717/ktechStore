using ktechStore.Application.DTOs;
using ktechStore.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AspnetCoreMvcFull.Areas.Vendor.Controllers
{
  [Area("Vendor")]
  [AllowAnonymous]
  public class AccountController : Controller
  {
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AccountController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
    {
      _signInManager = signInManager;
      _userManager = userManager;
    }

    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
      ViewData["ReturnUrl"] = returnUrl;
      return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginDto dto, string? returnUrl = null)
    {
      if (!ModelState.IsValid) return View(dto);

      var user = await _userManager.FindByEmailAsync(dto.Email);

      // 🔥 Zaroori check — sirf Vendor role wale hi is form se login kar sakein
      if (user != null)
      {
        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains("Vendor"))
        {
          ModelState.AddModelError(string.Empty, "This login is only for Vendors.");
          return View(dto);
        }
      }

      var result = await _signInManager.PasswordSignInAsync(dto.Email, dto.Password, dto.RememberMe, lockoutOnFailure: false);

      if (result.Succeeded)
      {
        if (!string.IsNullOrEmpty(returnUrl))
          return LocalRedirect(returnUrl);

        return RedirectToAction("Index", "Dashboard", new { area = "Vendor" });
      }

      ModelState.AddModelError(string.Empty, "Invalid email or password.");
      return View(dto);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
      await _signInManager.SignOutAsync();
      return RedirectToAction("Login");
    }
  }
}
