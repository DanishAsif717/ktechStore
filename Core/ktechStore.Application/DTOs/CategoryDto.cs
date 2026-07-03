using System;
using System.Collections.Generic;
using System.Text;
using ktechStore.Core.Enums;

namespace ktechStore.Application.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public CategoryStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
