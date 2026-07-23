export interface ProductDetailDto {
    id: number;
    size?: string;
    color?: string;
    price?: number;
    stock: number;
    imageUrl?: string;
}

export interface ProductApiResponse {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    sku?: string;
    imageUrl?: string;
    isActive: boolean;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    productDetails: ProductDetailDto[];
}

export interface CategoryApiResponse {
    id: number;
    name: string;
    description?: string;
    status: number;   
    createdAt: string;
}