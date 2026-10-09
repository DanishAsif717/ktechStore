using AspnetCoreMvcFull.Extensions;
using ktechStore.Application;
using ktechStore.Core.Entities;
using ktechStore.Infrastructure;
using ktechStore.Infrastructure.Logging;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using NToastNotify;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(AppContext.BaseDirectory);
builder.Configuration.AddJsonFile("sharedsettings.json", optional: true, reloadOnChange: true);
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

builder.Host.AddSharedLogging("Web");

builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddControllersWithViews(options =>
{
  var policy = new AuthorizationPolicyBuilder()
      .RequireAuthenticatedUser()
      .Build();
  options.Filters.Add(new AuthorizeFilter(policy));
})
.AddRazorOptions(options =>
{
  options.ViewLocationFormats.Add("/Views/Shared/{0}.cshtml");
})
.AddNToastNotifyToastr(new ToastrOptions()
{
  ProgressBar = true,
  PositionClass = ToastPositions.TopRight
});

// Cookie authentication configure 
builder.Services.ConfigureApplicationCookie(options =>
{
  options.LoginPath = "/Account/Login";
  options.AccessDeniedPath = "/Account/AccessDenied";
  options.Cookie.Name = "KtechStoreAdminAuth";
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
  app.UseExceptionHandler("/Home/Error");
  app.UseHsts();
}

if (!app.Environment.IsProduction())
{
  app.UseHttpsRedirection();
}

// Single Standard Static Files Middleware
app.Use((context, next) =>
{
    context.Request.PathBase = "/admin";
    return next();
});
app.UseStaticFiles();
app.UseNToastNotify();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapAdminRoutes();



using (var scope = app.Services.CreateScope())
{
  var services = scope.ServiceProvider;

  var roleManager =
      services.GetRequiredService<RoleManager<IdentityRole>>();

  var userManager =
      services.GetRequiredService<UserManager<ApplicationUser>>();

  var adminEmail = builder.Configuration["Admin:Email"];
  var adminPassword = builder.Configuration["Admin:Password"];

  if (string.IsNullOrWhiteSpace(adminEmail) ||
      string.IsNullOrWhiteSpace(adminPassword))
  {
    throw new InvalidOperationException(
        "Admin credentials are missing from configuration.");
  }

  string[] roles = { "Admin", "Vendor" };

  foreach (var role in roles)
  {
    if (!await roleManager.RoleExistsAsync(role))
    {
      var roleResult = await roleManager.CreateAsync(
          new IdentityRole(role));

      if (!roleResult.Succeeded)
        throw new Exception("Failed to create role: " + role);
    }
  }

  var adminUser = await userManager.FindByEmailAsync(adminEmail);

  if (adminUser == null)
  {
    adminUser = new ApplicationUser
    {
      UserName = adminEmail,
      Email = adminEmail,
      FullName = "Super Admin",
      EmailConfirmed = true
    };

    var result = await userManager.CreateAsync(
        adminUser, adminPassword);

    if (!result.Succeeded)
    {
      throw new Exception(
          "Admin creation failed: " +
          string.Join(", ", result.Errors.Select(e => e.Code)));
    }
  }

  if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
  {
    var result = await userManager.AddToRoleAsync(
        adminUser, "Admin");

    if (!result.Succeeded)
      throw new Exception("Failed to assign Admin role.");
  }
}
app.Run();
