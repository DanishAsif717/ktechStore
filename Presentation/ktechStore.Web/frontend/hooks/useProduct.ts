import { useState, useEffect } from "react";
import type { Product } from "@/types";
import { fetchProductBySlug } from "@/lib/services/product.service";

export function useProduct(slug: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchProductBySlug(slug)
            .then(data => {
                if (!cancelled) {
                    setProduct(data);
                    setError(null);
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load product");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [slug]);

    return { product, loading, error };
}
