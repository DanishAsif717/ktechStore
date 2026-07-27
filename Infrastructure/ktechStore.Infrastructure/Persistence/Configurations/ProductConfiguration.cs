using ktechStore.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ktechStore.Infrastructure.Persistence.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasIndex(p => p.SKU)
                   .IsUnique();

            builder.HasOne(p => p.Vendor)
                  .WithMany(v => v.Products)
                  .HasForeignKey(p => p.VendorId)
                  .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
