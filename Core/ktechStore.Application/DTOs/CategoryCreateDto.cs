using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using ktechStore.Core.Enums;
namespace ktechStore.Application.DTOs
{
    public class CategoryCreateDto
    {
        [Required(ErrorMessage = "Category ka naam zaroori hai!")]
        [StringLength(100, ErrorMessage = "Naam 100 lafzon se bara nahi hona chahiye.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description 500 lafzon se bari nahi honi chahiye.")]
        public string Description { get; set; } = string.Empty;

        // Default status humne Active rakh diya Enum use karke
        public CategoryStatus Status { get; set; } = CategoryStatus.Active;
    }
}
