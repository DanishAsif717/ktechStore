import { ProductDetail } from ".";

export interface Product {
    id: number;
    vendorId: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    category: string;
    subcategory: string;
    unit: string;
    stock: number;
    rating: number;
    reviewCount: number;
    isFeatured?: boolean;
    discount?: number;
    tags: string[];
    specifications: { key: string; value: string; }[];
    createdAt: string;
    productDetails: ProductDetail[];

}
