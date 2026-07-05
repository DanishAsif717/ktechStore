using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? SKU { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; } // View me Category Name dikhane ke liye
        public DateTime CreatedAt { get; set; }
    }
}
