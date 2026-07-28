using System.ComponentModel.DataAnnotations;

namespace ktechStore.Application.DTOs
{
    public class VendorApplicationDto
    {
        [Required(ErrorMessage = "Shop name is required")]
        [MaxLength(200)]
        public string ShopName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [MaxLength(20)]
        public string ContactPhone { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? BusinessDescription { get; set; }
    }
}
