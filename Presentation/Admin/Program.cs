using AspnetCoreMvcFull.Extensions;
using ktechStore.Application;
using ktechStore.Infrastructure;
using ktechStore.Infrastructure.Logging;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(AppContext.BaseDirectory);
builder.Configuration.AddJsonFile("sharedsettings.json", optional: true, reloadOnChange: true);
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

builder.Host.AddSharedLogging("Web");

builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddControllersWithViews()
    .AddRazorOptions(options =>
    {
      // Taaki areas ke views root ke shared folder se partial views utha sakein
      options.ViewLocationFormats.Add("/Views/Shared/{0}.cshtml");
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

app.UseRouting();
app.UseAuthorization();

app.MapAdminRoutes();

app.Run();
