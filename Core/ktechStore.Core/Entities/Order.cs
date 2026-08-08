using ktechStore.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ktechStore.Core.Entities
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        public int Id { get; set; }

        // ---------- Parent Link ----------

        [Required]
        public int OrderGroupId { get; set; }

        [ForeignKey(nameof(OrderGroupId))]
        public OrderGroup? OrderGroup { get; set; }

        // ---------- Vendor Link (nullable — Admin/platform products ke liye null) ----------

        public int? VendorId { get; set; }

        [ForeignKey(nameof(VendorId))]
        public Vendor? Vendor { get; set; }

        // ---------- Order Info ----------

        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        // ---------- Audit ----------

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // ---------- Navigation ----------

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
