namespace AspnetCoreMvcFull.Models
{
  public class Category
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Image { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
  }
}
