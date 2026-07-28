
namespace ktechStore.Application.DTOs
{
    public class VendorApplicationListDto
    {
        public int Id { get; set; }
        public string ShopName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string? BusinessDescription { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
    }
}
