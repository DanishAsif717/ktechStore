import { useState, useEffect } from "react";
import type { Category } from "@/types";
import { fetchCategoryBySlug } from "@/lib/services/category.service";

export function useCategory(slug: string) {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchCategoryBySlug(slug)
            .then(data => {
                if (!cancelled) {
                    setCategory(data);
                    setError(null);
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load category");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [slug]);

    return { category, loading, error };
}
