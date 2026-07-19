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
        vendorId: "",                          // Vendor Flow abhi nahi bana
        name: p.name,
        slug: slugify(p.name),
        description: p.description ?? "",
        price: p.price,
        originalPrice: undefined,
        images: p.imageUrl ? [p.imageUrl] : [],
        category: p.categoryName,
        subcategory: "",                       // Backend me abhi field nahi hai
        unit: "pc",
        inStock: p.isActive && p.stock > 0,
        rating: 0,                             // Reviews system abhi nahi bana
        reviewCount: 0,
        isFeatured: false,
        discount: undefined,
        tags: [],
        specifications: p.productDetails.map(d => ({
            key: [d.size, d.color].filter(Boolean).join(" / ") || "Variant",
            value: `Rs. ${d.price ?? p.price} - Stock: ${d.stock}`,
        })),
        createdAt: p.createdAt,
    };
}