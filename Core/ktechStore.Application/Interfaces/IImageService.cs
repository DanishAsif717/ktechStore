using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ktechStore.Application.Interfaces
{
    public interface IImageService
    {
      Task<string> UploadImageAsync(IFormFile file, string folderName);
      Task<bool> DeleteImageAsync(string imageUrl);
    }
}
