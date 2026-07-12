using Microsoft.Extensions.DependencyInjection;
using ktechStore.Application.Interfaces;
using ktechStore.Application.Services;

namespace ktechStore.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IProductService, ProductService>();

            return services;
        }
    }
}