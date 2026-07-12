using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using ktechStore.Application.Validations;


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

        [RequiredIfIdZero(ErrorMessage = "Product image is required")]
        public IFormFile? ProductImageFile { get; set; }

        [Required(ErrorMessage = "Please select a category")]
        public int CategoryId { get; set; }
        public List<ProductDetailDto> ProductDetails { get; set; } = new List<ProductDetailDto>();
    }
}
