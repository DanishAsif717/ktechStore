using ktechStore.Application.Interfaces;
using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using ktechStore.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ktechStore.Infrastructure.ThirdParty; 


namespace ktechStore.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString, b => b.MigrationsAssembly("ktechStore.Infrastructure")));

            // Saari Repositories yahan aayengi
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IModuleService, ModuleRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();

            services.AddScoped<IImageService, CloudinaryService>();

            return services;
        }
    }
}