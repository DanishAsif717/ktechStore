using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using ktechStore.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.SetBasePath(AppContext.BaseDirectory);

builder.Configuration.AddJsonFile("sharedsettings.json", optional: true, reloadOnChange: true);
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine($"====== MY CONNECTION STRING:TRdt {connectionString} ======");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("ktechStore.Infrastructure")));


//Repositries

builder.Services.AddScoped<ICategoryService, CategoryRepository>();

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapStaticAssets();

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    endpoints.MapReverseProxy();

    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});


app.Run();
