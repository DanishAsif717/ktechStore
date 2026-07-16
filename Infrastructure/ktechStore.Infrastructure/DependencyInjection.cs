using ktechStore.Application.Interfaces;
using ktechStore.Core.Interfaces;
using ktechStore.Infrastructure.Persistence;
using ktechStore.Infrastructure.Repositories;
using ktechStore.Infrastructure.ThirdParty; 
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ktechStore.Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace ktechStore.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString, b => b.MigrationsAssembly("ktechStore.Infrastructure")));


            // 🔥 Identity register 
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();


            //Repositories 
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IModuleService, ModuleRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();

            services.AddScoped<IImageService, CloudinaryService>();
            services.AddScoped<IMistralService, MistralService>();

            return services;
        }
    }
}