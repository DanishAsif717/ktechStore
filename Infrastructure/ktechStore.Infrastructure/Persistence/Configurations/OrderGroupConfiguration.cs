using ktechStore.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Infrastructure.Persistence.Configurations
{
    public class OrderGroupConfiguration : IEntityTypeConfiguration<OrderGroup>
    {
        public void Configure(EntityTypeBuilder<OrderGroup> builder)
        {
            builder.HasMany(og => og.Orders)
                   .WithOne(o => o.OrderGroup)
                   .HasForeignKey(o => o.OrderGroupId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
