using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ktechStore.Core.Entities;
using System.Text;

namespace ktechStore.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Future configuration configurations yahan aayengi
        }
    }
}
