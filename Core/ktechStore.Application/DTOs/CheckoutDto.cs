using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ktechStore.Application.DTOs
{
    public class CheckoutItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
    public class CheckoutDto
    {
        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        public string CustomerPhone { get; set; } = string.Empty;

        [Required]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        public List<CheckoutItemDto> Items { get; set; } = new();
    }
    public class CheckoutResultDto
    {
        public int OrderGroupId { get; set; }
        //public string JazzCashPostUrl { get; set; } = string.Empty;
        public string Message { get; set; } = "Order placed successfully";

    }
}
