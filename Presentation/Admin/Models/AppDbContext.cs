using Microsoft.Build.Tasks.Deployment.Bootstrapper;
using Microsoft.EntityFrameworkCore;
using AspnetCoreMvcFull.Models;

namespace AspnetCoreMvcFull.Models
{
  public partial class AppDbContext : DbContext
  {
    public AppDbContext()
    {
    }
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    //models Define
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }

    

  }
}
