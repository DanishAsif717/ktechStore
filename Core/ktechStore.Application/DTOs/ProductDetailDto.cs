using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.DTOs
{
    public class ProductDetailDto
    {
        public int Id { get; set; }
        public decimal? Price { get; set; }
        public int Stock { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
        public string? ImageUrl { get; set; }
    }
}
