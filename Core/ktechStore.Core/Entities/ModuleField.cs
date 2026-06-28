using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Core.Entities
{
  
    public class ModuleField
    {
        public int Id { get; set; }
        public int ModuleDefinitionId { get; set; }
        public string FieldName { get; set; }
        public string FieldType { get; set; } // Text, Number, Boolean, Date, Email, TextArea
        public bool IsRequired { get; set; }
        public int DisplayOrder { get; set; }

        public bool IsForeignKey { get; set; }
        public string? RelatedTable { get; set; }
        public ModuleDefinition ModuleDefinition { get; set; }
    }
}
