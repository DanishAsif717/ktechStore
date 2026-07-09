using ktechStore.Application.DTOs;
using ktechStore.Core.Entities;
using ktechStore.Application.Extensions; 
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace ktechStore.Application.Extensions
{
    public static class ProductImageExtensions
    {
        // 1. Main image change hone par purani image track karna
        public static void TrackMainImageReplacement(this Product product, ProductUpsertDto dto, List<string> trackingList)
        {
            if (dto.ProductImageFile != null && dto.ProductImageFile.Length > 0 && !string.IsNullOrEmpty(product.ImageUrl))
            {
                trackingList.Add(product.ImageUrl);
            }
        }

        // 2. Jo variants remove (delete) kiye gaye hain, unki images track karna
        public static void TrackRemovedVariantsImages(this Product product, ProductUpsertDto dto, List<string> trackingList)
        {
            if (dto.ProductDetails == null) return;

            var incomingDetailIds = dto.ProductDetails.Where(d => d.Id > 0).Select(d => d.Id).ToList();
            var detailsToDelete = product.ProductDetails.Where(d => !incomingDetailIds.Contains(d.Id)).ToList();

            foreach (var detail in detailsToDelete)
            {
                if (!string.IsNullOrEmpty(detail.ImageUrl))
                {
                    trackingList.Add(detail.ImageUrl);
                }
            }
        }

        // 3. Kisi existing variant ki image change hone par purani track karna
        public static void TrackVariantImageReplacement(this ProductDetail existingDetail, ProductDetailDto detailDto, List<string> trackingList)
        {
            if (detailDto.VariantImageFile != null && detailDto.VariantImageFile.Length > 0 && !string.IsNullOrEmpty(existingDetail.ImageUrl))
            {
                trackingList.Add(existingDetail.ImageUrl);
            }
        }

        // 4. Product ke saare variants ki images ko ek sath track karna (Delete product ke waqt)
        public static void TrackAllVariantsImages(this Product product, List<string> trackingList)
        {
            if (product.ProductDetails == null) return;

            foreach (var detail in product.ProductDetails)
            {
                if (!string.IsNullOrEmpty(detail.ImageUrl))
                {
                    trackingList.Add(detail.ImageUrl);
                }
            }
        }
    }
}
