using AspnetCoreMvcFull.Models;
using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using ktechStore.Infrastructure.Repositories;
using Microsoft.DotNet.Scaffolding.Shared.ProjectModel;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(AppContext.BaseDirectory);
builder.Configuration.AddJsonFile("sharedsettings.json", optional: true, reloadOnChange: true);
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"====== MY CONNECTION STRING: {connectionString} ======");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("ktechStore.Infrastructure")));

// Repositories
builder.Services.AddScoped<ICategoryService, CategoryRepository>();
builder.Services.AddScoped<IModuleService, ModuleRepository>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddControllersWithViews();
// Note: AddApplicationPart ki zaroorat nahi agar Area controller isi project (AspnetCoreMvcFull) ke andar hai.
// Wo sirf tab chahiye jab controller kisi ALAG assembly/project me ho.

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
  app.UseExceptionHandler("/Home/Error");
  app.UseHsts();
}

app.Use((context, next) =>
{
  context.Request.PathBase = "/admin";   // 👈 Hamesha force karo, condition check nahi
  return next();
});
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
  // 1. Area route (ye SABSE ZAROORI hai — is ke bina koi bhi Area controller call nahi hoga)
  endpoints.MapControllerRoute(
      name: "areas",
      pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

  // 2. Module record route
  endpoints.MapControllerRoute(
      name: "module-record",
      pattern: "{controller}/{action}/{id}/{recordId}",
      defaults: new { controller = "ModuleBuilder" });

  // 3. Default route
  endpoints.MapControllerRoute(
      name: "default",
      pattern: "{controller=Dashboards}/{action=Index}/{id?}");
});

app.Run();
