using Microsoft.AspNetCore.Builder;

namespace AspnetCoreMvcFull.Extensions
{
  public static class MappingRoutes
  {
    // 🎯 `this IEndpointRouteBuilder` ko badal kar `this WebApplication` kar diya
    public static void MapAdminRoutes(this WebApplication app)
    {
      // 1. Area route
      app.MapControllerRoute(
          name: "areas",
          pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

      // 2. Module record route
      app.MapControllerRoute(
          name: "module-record",
          pattern: "{controller}/{action}/{id}/{recordId}",
          defaults: new { controller = "ModuleBuilder" });

      // 3. Default route
      app.MapControllerRoute(
          name: "default",
          pattern: "{controller=Dashboards}/{action=Index}/{id?}");
    }
  }
}
