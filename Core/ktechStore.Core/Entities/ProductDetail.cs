using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ktechStore.Core.Entities
{
    [Table("ProductDetails")]
    public class ProductDetail
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; }

        public int Stock { get; set; } = 0;

        [MaxLength(100)]
        public string? Size { get; set; } 

        [MaxLength(100)]
        public string? Color { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }
    }
}