import { useState, useEffect } from "react";
import type { Product } from "@/types/Product";
import { fetchProducts } from "@/lib/services/product.service";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchProducts()
            .then(data => {
                if (!cancelled) {
                    setProducts(data);
                    setError(null);
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load products");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    return { products, loading, error };
}
