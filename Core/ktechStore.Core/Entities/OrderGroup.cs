using ktechStore.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ktechStore.Core.Entities
{
    [Table("OrderGroups")]
    public class OrderGroup
    {
        [Key]
        public int Id { get; set; }

        // ---------- Guest Customer Info ----------

        [Required]
        [MaxLength(200)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(200)]
        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string CustomerPhone { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        // ---------- Payment Info ----------

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        [MaxLength(200)]
        public string? StripePaymentIntentId { get; set; }

        // ---------- Audit ----------

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ---------- Navigation ----------

        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
