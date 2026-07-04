using AspnetCoreMvcFull.Extensions;
using ktechStore.Application;
using Microsoft.EntityFrameworkCore;
using ktechStore.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(AppContext.BaseDirectory);
builder.Configuration.AddJsonFile("sharedsettings.json", optional: true, reloadOnChange: true);
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//Console.WriteLine($"====== MY CONNECTION STRING: {connectionString} ======");

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("ktechStore.Infrastructure")));

builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddControllersWithViews();


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
