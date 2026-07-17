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


// 🔥 Cookie authentication configure 
builder.Services.ConfigureApplicationCookie(options =>
{
  options.LoginPath = "/Account/Login";
  options.AccessDeniedPath = "/Account/AccessDenied";
  options.Cookie.Name = "KtechStoreAdminAuth";
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
  app.UseExceptionHandler("/Home/Error");
  app.UseHsts();
}

app.Use((context, next) =>
{
  context.Request.PathBase = "/admin";  
  return next();
});
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseNToastNotify();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapAdminRoutes();

using (var scope = app.Services.CreateScope())
{
  var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
  string[] roles = { "Admin", "Vendor" };
  foreach (var role in roles)
  {
    if (!await roleManager.RoleExistsAsync(role))
      await roleManager.CreateAsync(new IdentityRole(role));
  }

  var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
  var adminEmail = "admin@ktechstore.com";
  if (await userManager.FindByEmailAsync(adminEmail) == null)
  {
    var adminUser = new ApplicationUser
    {
      UserName = adminEmail,
      Email = adminEmail,
      FullName = "Super Admin",
      EmailConfirmed = true
    };
    var result = await userManager.CreateAsync(adminUser, "Admin@123");
    if (result.Succeeded)
    {
      await userManager.AddToRoleAsync(adminUser, "Admin");
    }
  }
}
app.Run();
