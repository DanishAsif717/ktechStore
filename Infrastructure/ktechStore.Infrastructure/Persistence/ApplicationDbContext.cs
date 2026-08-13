using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ktechStore.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ktechStore.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductDetail> ProductDetails { get; set; }
        public DbSet<ModuleDefinition> ModuleDefinitions { get; set; }
        public DbSet<ModuleField> ModuleFields { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<VendorApplication> VendorApplications { get; set; }
        public DbSet<CategoryRequest> CategoryRequests { get; set; }
        public DbSet<OrderGroup> OrderGroups { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
