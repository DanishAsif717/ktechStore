using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Core.Entities
{
    public class ModuleDefinition
    {
        public int Id { get; set; }
        public string ModuleName { get; set; }
        public string TableName { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<ModuleField> Fields { get; set; }
    }
}
