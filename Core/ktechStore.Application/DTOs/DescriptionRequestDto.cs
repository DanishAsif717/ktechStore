using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.DTOs
{
    public class DescriptionRequestDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
    }
}
