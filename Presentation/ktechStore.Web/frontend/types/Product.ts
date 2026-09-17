import { ProductDetail } from ".";

export interface Product {
    imageUrl: string;
    id: number;
    vendorId: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    subcategory: string;
    unit: string;
    inStock: boolean;
    rating: number;
    reviewCount: number;
    isFeatured?: boolean;
    discount?: number;
    tags: string[];
    specifications: { key: string; value: string; }[];
    createdAt: string;
    productDetails: ProductDetail[];

}
