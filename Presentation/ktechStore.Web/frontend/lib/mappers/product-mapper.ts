import type { ProductApiResponse } from "@/types/api";
import type { Product } from "@/types";

function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function mapApiProductToProduct(p: ProductApiResponse): Product {
    return {
        id: p.id,
        vendorId: "",                          
        name: p.name,
        slug: slugify(p.name),
        description: p.description ?? "",
        price: p.price,
        originalPrice: undefined,
        images: p.imageUrl ?? "" ,
        category: p.categoryName,
        subcategory: "",                       
        unit: "pc",
        inStock: p.isActive && p.stock > 0,
        rating: 0,                             
        reviewCount: 0,
        isFeatured: false,
        discount: undefined,
        tags: [],
        specifications: p.productDetails.map(d => ({
            key: [d.size, d.color].filter(Boolean).join(" / ") || "Variant",
            value: `Rs. ${d.price ?? p.price} - Stock: ${d.stock}`,
        })),
        createdAt: p.createdAt,
        productDetails: p.productDetails.map((d) => ({
            id: d.id,
            price: d.price ?? undefined,
            stock: d.stock,
            size: d.size ?? undefined,
            color: d.color ?? undefined,
            imageUrl: d.imageUrl ?? undefined,
        })),
    };
}