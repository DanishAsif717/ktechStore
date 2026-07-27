using ktechStore.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ktechStore.Core.Entities
{
    [Table("VendorApplications")]
    public class VendorApplication
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string ShopName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ContactPhone { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? BusinessDescription { get; set; }

        public VendorStatus Status { get; set; } = VendorStatus.Pending;

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReviewedAt { get; set; }

        [MaxLength(100)]
        public string? ReviewedBy { get; set; }
    }
}
