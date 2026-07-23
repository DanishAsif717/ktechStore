import { useState, useEffect } from "react";
import type { Product } from "@/types";
import type { ProductApiResponse } from "@/types/api";
import { mapApiProductToProduct } from "@/lib/mappers/product-mapper";

const baseUrl = typeof window === "undefined" ? process.env.INTERNAL_API_URL : "";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${baseUrl}/api/products`, { cache: "no-store" })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch products");
                return res.json();
            })
            .then((data: ProductApiResponse[]) => {
                setProducts(data.map(mapApiProductToProduct));
            })
            .catch(err => {
                console.error("Failed to load products:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { products, loading, error };
}