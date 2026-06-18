using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AspnetCoreMvcFull.Models
{

  public class Product
  {
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [StringLength(500)]
    public string Description { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public string? Image { get; set; }

    // Foreign Key
    [Required]
    public int CategoryId { get; set; }

    // Navigation property
    [ForeignKey("CategoryId")]
    [ValidateNever]
    public Category Category { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "active";
  }
}
