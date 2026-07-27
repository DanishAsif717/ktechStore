import { useState, useEffect } from "react";
import type { Category } from "@/types";
import { fetchCategories } from "@/lib/services/category.service";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchCategories()
            .then(data => {
                if (!cancelled) {
                    setCategories(data);
                    setError(null);
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load categories");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    return { categories, loading, error };
}
