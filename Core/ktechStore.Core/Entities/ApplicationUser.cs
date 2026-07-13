using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;   

namespace ktechStore.Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
