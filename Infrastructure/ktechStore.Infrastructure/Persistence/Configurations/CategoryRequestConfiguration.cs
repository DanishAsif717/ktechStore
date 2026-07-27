using ktechStore.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace ktechStore.Infrastructure.Persistence.Configurations
{
    public class CategoryRequestConfiguration : IEntityTypeConfiguration<CategoryRequest>
    {
        public void Configure(EntityTypeBuilder<CategoryRequest> builder)
        {
            builder.HasOne(cr => cr.RequestedByVendor)
                   .WithMany()
                   .HasForeignKey(cr => cr.RequestedByVendorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(cr => cr.ApprovedCategory)
                   .WithMany()
                   .HasForeignKey(cr => cr.ApprovedCategoryId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
