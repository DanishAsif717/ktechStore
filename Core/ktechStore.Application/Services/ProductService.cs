using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Core.Interfaces;

namespace ktechStore.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;

        public ProductService(IProductRepository productRepo)
        {
            _productRepo = productRepo;
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
                CreatedAt = p.CreatedAt
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

        public async Task CreateProductAsync(ProductUpsertDto dto, string user)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                SKU = dto.SKU,
                ImageUrl = dto.ImageUrl,
                IsActive = dto.IsActive,
                CategoryId = dto.CategoryId,
                CreatedBy = user,
                CreatedAt = DateTime.UtcNow
            };
            if (dto.ProductDetails != null && dto.ProductDetails.Any())
            {
                foreach (var detailDto in dto.ProductDetails)
                {
                    product.ProductDetails.Add(new ProductDetail
                    {
                        Price = detailDto.Price ?? dto.Price, 
                        Size = detailDto.Size,
                        Color = detailDto.Color,
                        ImageUrl = detailDto.ImageUrl
                    });
                }
            }
            await _productRepo.AddAsync(product);
        }

        public async Task UpdateProductAsync(ProductUpsertDto dto, string user)
        {
            var product = await _productRepo.GetByIdAsync(dto.Id);
            if (product == null) throw new KeyNotFoundException("Product not found");

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.SKU = dto.SKU;
            product.ImageUrl = dto.ImageUrl;
            product.IsActive = dto.IsActive;
            product.CategoryId = dto.CategoryId;
            product.UpdatedBy = user;
            product.UpdatedAt = DateTime.UtcNow;

            if (dto.ProductDetails != null)
            {
                var incomingDetailIds = dto.ProductDetails.Where(d => d.Id > 0).Select(d => d.Id).ToList();
                var detailsToDelete = product.ProductDetails.Where(d => !incomingDetailIds.Contains(d.Id)).ToList();

                foreach (var detailToDelete in detailsToDelete)
                {
                    product.ProductDetails.Remove(detailToDelete);
                }

                foreach (var detailDto in dto.ProductDetails)
                {
                    if (detailDto.Id > 0)
                    {
                        var existingDetail = product.ProductDetails.FirstOrDefault(d => d.Id == detailDto.Id);
                        if (existingDetail != null)
                        {
                            existingDetail.Price = detailDto.Price ?? dto.Price;
                            existingDetail.Stock = detailDto.Stock;
                            existingDetail.Size = detailDto.Size;
                            existingDetail.Color = detailDto.Color;
                            existingDetail.ImageUrl = detailDto.ImageUrl;
                        }
                    }
                    else
                    {
                        product.ProductDetails.Add(new ProductDetail
                        {
                            Price = detailDto.Price ?? dto.Price,
                            Stock = detailDto.Stock,
                            Size = detailDto.Size,
                            Color = detailDto.Color,
                            ImageUrl = detailDto.ImageUrl
                        });
                    }
                }
            }
            else
            {
                product.ProductDetails.Clear();
            }


            await _productRepo.UpdateAsync(product);
        }

        public async Task DeleteProductAsync(int id)
        {
            await _productRepo.DeleteAsync(id);
        }
    }
}
