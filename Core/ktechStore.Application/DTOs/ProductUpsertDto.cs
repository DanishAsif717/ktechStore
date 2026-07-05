using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace ktechStore.Application.DTOs
{
    public class ProductUpsertDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Product name is required")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Price is required")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock quantity is required")]
        public int Stock { get; set; }

        [StringLength(50)]
        public string? SKU { get; set; }

        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;

        [Required(ErrorMessage = "Please select a category")]
        public int CategoryId { get; set; }
        public List<ProductDetailDto> ProductDetails { get; set; } = new List<ProductDetailDto>();
    }
}
