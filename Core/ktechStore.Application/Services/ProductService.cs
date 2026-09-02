using ktechStore.Application.DTOs;
using ktechStore.Application.Extensions;
using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Core.Enums;
using ktechStore.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Serilog;


namespace ktechStore.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly IImageService _imageService;
        private readonly IMistralService _mistralService;

        public ProductService(IProductRepository productRepo, IImageService imageService, IMistralService mistralService)
        {
            _productRepo = productRepo;
            _imageService = imageService;
            _mistralService = mistralService;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepo.GetAllAsync();
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                SKU = p.SKU,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "No Category",
                CreatedAt = p.CreatedAt,
                ProductDetails = p.ProductDetails?
                            .Select(d => new ProductDetailDto
                            {
                                Id = d.Id,
                                Price = d.Price,
                                Stock = d.Stock,
                                Size = d.Size,
                                Color = d.Color,
                                ImageUrl = d.ImageUrl
                            })
                            .ToList() ?? new List<ProductDetailDto>()
            });
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var p = await _productRepo.GetByIdAsync(id);
            if (p == null) return null;

            return new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                SKU = p.SKU,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "No Category",
                CreatedAt = p.CreatedAt,

                ProductDetails = p.ProductDetails.Select(pd => new ProductDetailDto
                {
                    Id = pd.Id,
                    Size = pd.Size,
                    Color = pd.Color,
                    Price = pd.Price,
                    Stock = pd.Stock,
                    ImageUrl = pd.ImageUrl
                }).ToList()
            };
        }

        public async Task<ProductUpsertDto?> GetProductForEditAsync(int id)
        {
            var p = await _productRepo.GetByIdAsync(id);
            if (p == null) return null;

            return new ProductUpsertDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                SKU = p.SKU,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,

                ProductDetails = p.ProductDetails.Select(d => new ProductDetailDto
                {
                    Id = d.Id,
                    Price = d.Price,
                    Stock = d.Stock,
                    Size = d.Size,
                    Color = d.Color,
                    ImageUrl = d.ImageUrl
                }).ToList()
            };
        }

        public async Task CreateProductAsync(ProductUpsertDto dto, string user, int? vendorId = null)
        {
            string uploadedUrl = await HandleProductImageUploadAsync(dto.ProductImageFile, dto.ImageUrl);
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                SKU = dto.SKU,
                ImageUrl = uploadedUrl,
                IsActive = dto.IsActive,
                Status = vendorId.HasValue ? ProductStatus.Pending : ProductStatus.Approved,
                CategoryId = dto.CategoryId,
                VendorId = vendorId,
                CreatedBy = user,
                CreatedAt = DateTime.UtcNow
            };
            if (dto.ProductDetails != null && dto.ProductDetails.Any())
            {
                foreach (var detailDto in dto.ProductDetails)
                {
                    string variantUploadedUrl = await HandleProductImageUploadAsync(detailDto.VariantImageFile, detailDto.ImageUrl);
                    product.ProductDetails.Add(new ProductDetail
                    {
                        Price = detailDto.Price ?? dto.Price, 
                        Size = detailDto.Size,
                        Color = detailDto.Color,
                        ImageUrl = variantUploadedUrl
                    });
                }
            }
            await _productRepo.AddAsync(product);
        }

        public async Task UpdateProductAsync(ProductUpsertDto dto, string user)
        {
            var product = await _productRepo.GetByIdAsync(dto.Id);
            if (product == null) throw new KeyNotFoundException("Product not found");

            List<string> oldImagesToDelete = new List<string>();

            // 🔥 EXTENSION METHOD USE: Direct product object par call ho raha hy (Laravel Trait vibe)
            product.TrackMainImageReplacement(dto, oldImagesToDelete);

            string updatedMainImageUrl = await HandleProductImageUploadAsync(dto.ProductImageFile, dto.ImageUrl);

            // Base properties map kiye
            MapBaseProductDetails(dto, product, updatedMainImageUrl, user);

            // Variants process kiye
            await ProcessProductVariantsAsync(dto, product, oldImagesToDelete);

            await _productRepo.UpdateAsync(product);

            // Background cleanup trigger kiya
            TriggerCloudCleanup(oldImagesToDelete);
        }
        public async Task DeleteProductAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null) return;

            List<string> imagesToDelete = new List<string>();

            if (!string.IsNullOrEmpty(product.ImageUrl)) imagesToDelete.Add(product.ImageUrl);

            // 🔥 EXTENSION METHOD USE
            product.TrackAllVariantsImages(imagesToDelete);

            TriggerCloudCleanup(imagesToDelete);
            await _productRepo.DeleteAsync(id);
        }

        #region 💡 Clean Private Helpers

        private void MapBaseProductDetails(ProductUpsertDto dto, Product product, string mainImageUrl, string user)
        {
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.SKU = dto.SKU;
            product.ImageUrl = mainImageUrl;
            product.IsActive = dto.IsActive;
            product.CategoryId = dto.CategoryId;
            product.UpdatedBy = user;
            product.UpdatedAt = DateTime.UtcNow;
        }

        private async Task ProcessProductVariantsAsync(ProductUpsertDto dto, Product product, List<string> oldImagesToDelete)
        {
            if (dto.ProductDetails == null || !dto.ProductDetails.Any())
            {
                product.TrackAllVariantsImages(oldImagesToDelete); // 🔥 EXTENSION
                product.ProductDetails.Clear();
                return;
            }

            product.TrackRemovedVariantsImages(dto, oldImagesToDelete); // 🔥 EXTENSION
            RemoveDeletedVariantsFromCollection(dto, product);

            foreach (var detailDto in dto.ProductDetails)
            {
                if (detailDto.Id > 0)
                {
                    await UpdateExistingVariantAsync(detailDto, product, oldImagesToDelete);
                }
                else
                {
                    await AddNewVariantAsync(detailDto, product);
                }
            }
        }

        private void RemoveDeletedVariantsFromCollection(ProductUpsertDto dto, Product product)
        {
            var incomingDetailIds = dto.ProductDetails.Where(d => d.Id > 0).Select(d => d.Id).ToList();
            var toRemove = product.ProductDetails.Where(d => !incomingDetailIds.Contains(d.Id)).ToList();
            foreach (var r in toRemove) product.ProductDetails.Remove(r);
        }

        private async Task UpdateExistingVariantAsync(ProductDetailDto detailDto, Product product, List<string> oldImagesToDelete)
        {
            var existingDetail = product.ProductDetails.FirstOrDefault(d => d.Id == detailDto.Id);
            if (existingDetail == null) return;

            existingDetail.TrackVariantImageReplacement(detailDto, oldImagesToDelete);

            string variantImageUrl = await HandleProductImageUploadAsync(detailDto.VariantImageFile, detailDto.ImageUrl);

            existingDetail.Price = detailDto.Price ?? product.Price;
            existingDetail.Stock = detailDto.Stock;
            existingDetail.Size = detailDto.Size;
            existingDetail.Color = detailDto.Color;
            existingDetail.ImageUrl = variantImageUrl;
        }

        private async Task AddNewVariantAsync(ProductDetailDto detailDto, Product product)
        {
            string variantImageUrl = await HandleProductImageUploadAsync(detailDto.VariantImageFile, detailDto.ImageUrl);
            product.ProductDetails.Add(new ProductDetail
            {
                Price = detailDto.Price ?? product.Price,
                Stock = detailDto.Stock,
                Size = detailDto.Size,
                Color = detailDto.Color,
                ImageUrl = variantImageUrl
            });
        }

        private void TriggerCloudCleanup(List<string> images)
        {
            if (images != null && images.Any())
            {
                _ = CleanupProductImagesFromCloudAsync(images);
            }
        }

        private async Task CleanupProductImagesFromCloudAsync(List<string> imageUrls)
        {
            try
            {
                foreach (var url in imageUrls)
                {
                    await _imageService.DeleteImageAsync(url);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Async cloud cleanup failed: {ex.Message}");
            }
        }

        private async Task<string> HandleProductImageUploadAsync(IFormFile file, string existingUrl)
        {
            if (file != null && file.Length > 0)
            {
                Log.Information("Uploading image {FileName}, Size: {Size} bytes", file.FileName, file.Length);

                var cloudUrl = await _imageService.UploadImageAsync(file, "ktech_store_products_local");
                if (!string.IsNullOrEmpty(cloudUrl))
                {
                    Log.Information("Upload success: {Url}", cloudUrl);
                    return cloudUrl;
                }
                Log.Warning("Upload returned null/empty for {FileName}, falling back to existing URL", file.FileName);

            }
            return existingUrl;
        }

        #endregion
        public async Task<string> GenerateUniqueSkuAsync(string productName, string categoryName)
        {
            string sku = string.Empty;
            int attempts = 0;
            const int maxAttempts = 3;
            bool isUnique = false;

            while (attempts < maxAttempts && !isUnique)
            {
                sku = await _mistralService.GenerateSkuAsync(productName, categoryName);
                isUnique = !await _productRepo.SkuExistsAsync(sku);
                attempts++;
            }

            if (!isUnique)
            {
                sku = $"{sku}-{DateTime.UtcNow.Ticks.ToString().Substring(10)}";
            }

            return sku;
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByVendorAsync(int vendorId)
        {
            var products = await _productRepo.GetByVendorIdAsync(vendorId);
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                SKU = p.SKU,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "No Category",
                CreatedAt = p.CreatedAt
            });
        }

        public async Task<bool> IsProductOwnedByVendorAsync(int productId, int vendorId)
        {
            var product = await _productRepo.GetByIdAsync(productId);
            return product != null && product.VendorId == vendorId;
        }

        public async Task<List<PendingProductDto>> GetPendingProductsAsync()
        {
            var products = await _productRepo.GetByStatusAsync(ProductStatus.Pending);

            return products.Select(p => new PendingProductDto
            {
                Id = p.Id,
                Name = p.Name,
                ImageUrl = p.ImageUrl,
                Price = p.Price,
                VendorName = p.Vendor != null ? p.Vendor.ShopName : "N/A",   
                CategoryName = p.Category != null ? p.Category.Name : "N/A",
                CreatedAt = p.CreatedAt
            }).ToList();
        }

        public async Task<bool> ApproveProductAsync(int productId)
        {
            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null || product.Status != ProductStatus.Pending)
                return false;

            product.Status = ProductStatus.Approved;
            product.IsActive = true;

            await _productRepo.UpdateAsync(product);
            return true;
        }

        public async Task<bool> RejectProductAsync(int productId, string? reason)
        {
            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null || product.Status != ProductStatus.Pending)
                return false;

            product.Status = ProductStatus.Rejected;
            product.IsActive = false;
            product.RejectionReason = reason;

            await _productRepo.UpdateAsync(product);
            return true;
        }

        public async Task<int> CountApprovalsProductsAsync()
        {
            var pendingProducts = await _productRepo.GetByStatusAsync(ProductStatus.Pending);
            return pendingProducts.Count;
        }
    }
}
