using ktechStore.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace ktechStore.Infrastructure.Persistence.Configurations
{
    public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
    {
        public void Configure(EntityTypeBuilder<Vendor> builder)
        {
            builder.HasOne(v => v.ApplicationUser)
                   .WithMany()
                   .HasForeignKey(v => v.ApplicationUserId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
