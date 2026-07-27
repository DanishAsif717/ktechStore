using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ktechStore.Core.Enums;

namespace ktechStore.Core.Entities
{
    [Table("CategoryRequests")]
    public class CategoryRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int RequestedByVendorId { get; set; }

        [ForeignKey(nameof(RequestedByVendorId))]
        public Vendor? RequestedByVendor { get; set; }

        public CategoryRequestStatus Status { get; set; } = CategoryRequestStatus.Pending;

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReviewedAt { get; set; }

        [MaxLength(100)]
        public string? ReviewedBy { get; set; }

        public int? ApprovedCategoryId { get; set; }

        [ForeignKey(nameof(ApprovedCategoryId))]
        public Category? ApprovedCategory { get; set; }
    }
}
