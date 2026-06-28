namespace AspnetCoreMvcFull.Models
{
  public class CreateModuleViewModel
  {
    public string ModuleName { get; set; }
    public string TableName { get; set; }
    public List<FieldViewModel> Fields { get; set; } = new();
  }

  public class FieldViewModel
  {
    public string FieldName { get; set; }
    public string FieldType { get; set; }
    public bool IsRequired { get; set; }
    public int DisplayOrder { get; set; }

    public bool IsForeignKey { get; set; }
    public string? RelatedTable { get; set; }
  }
}
