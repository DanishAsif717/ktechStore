using AspnetCoreMvcFull.Extensions;
using ktechStore.Application;
using ktechStore.Infrastructure;
using ktechStore.Infrastructure.Logging;
using Microsoft.EntityFrameworkCore;
using NToastNotify;   


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
      options.ViewLocationFormats.Add("/Views/Shared/{0}.cshtml");
    })
    .AddNToastNotifyToastr(new ToastrOptions()   
    {
      ProgressBar = true,
      PositionClass = ToastPositions.TopRight
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
app.UseAuthorization();
app.MapAdminRoutes();
app.Run();
