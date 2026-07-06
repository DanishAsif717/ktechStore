using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.Interfaces
{
    public interface IMistralService
    {
        Task<string> GenerateDescriptionAsync(string productName, string categoryName);
        Task<string> GenerateSkuAsync(string productName, string categoryName);
    }
}
