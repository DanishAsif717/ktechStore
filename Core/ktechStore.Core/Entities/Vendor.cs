using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ktechStore.Core.Enums;

namespace ktechStore.Core.Entities
{
    [Table("Vendors")]
    public class Vendor
    {
        [Key]
        public int Id { get; set; }

        // ---------- Identity Link ----------

        [Required]
        public string ApplicationUserId { get; set; } = string.Empty;

        [ForeignKey(nameof(ApplicationUserId))]
        public ApplicationUser? ApplicationUser { get; set; }

        // ---------- Business Info ----------

        [Required]
        [MaxLength(200)]
        public string ShopName { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? BusinessDescription { get; set; }

        [MaxLength(20)]
        public string? ContactPhone { get; set; }

        public VendorStatus Status { get; set; } = VendorStatus.Pending;

        // ---------- Audit Fields ----------

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ApprovedAt { get; set; }

        // ---------- Navigation ----------

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
