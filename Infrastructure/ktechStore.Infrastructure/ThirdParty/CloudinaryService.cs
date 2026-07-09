using System;
using System.IO;
using System.Threading.Tasks; 
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Linq;

using Microsoft.Extensions.Configuration;

namespace ktechStore.Infrastructure.ThirdParty
{
    public class CloudinaryService : IImageService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            var config = configuration.GetSection("CloudinarySettings");

            var account = new Account(
                config["CloudName"] ?? throw new ArgumentNullException("Cloudinary CloudName is missing."),
                config["ApiKey"] ?? throw new ArgumentNullException("Cloudinary ApiKey is missing."),
                config["ApiSecret"] ?? throw new ArgumentNullException("Cloudinary ApiSecret is missing.")
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
                return null;

            var uploadResult = new ImageUploadResult();

            using (var stream = file.OpenReadStream())
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folderName,
                    Transformation = new Transformation().Quality("auto").FetchFormat("webp")
                };

                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult.SecureUrl?.ToString();
        }
        public async Task<bool> DeleteImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return false;

            try
            {
               
                var uri = new Uri(imageUrl);
                string pathWithExtension = uri.Segments.Last();

                string publicId = imageUrl.Split(new[] { "/v" }, StringSplitOptions.None)[1]
                                          .Split(new[] { '/' }, 2)[1]
                                          .Split('.')[0]; 

                var deleteParams = new DeletionParams(publicId);
                var result = await _cloudinary.DestroyAsync(deleteParams);

                return result.Result == "ok"; 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting image from Cloudinary: {ex.Message}");
                return false;
            }
        }



    }
}