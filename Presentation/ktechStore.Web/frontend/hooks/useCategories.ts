import { useState, useEffect } from "react";
import type { Category } from "@/types";
import type { CategoryApiResponse } from "@/types/api";
import { mapApiCategoryToCategory } from "@/lib/mappers/category-mapper";

const baseUrl = typeof window === "undefined" ? process.env.INTERNAL_API_URL : "";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${baseUrl}/api/categories`, { cache: "no-store" })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch categories");
                return res.json();
            })
            .then((data: CategoryApiResponse[]) => {
                setCategories(data.map(mapApiCategoryToCategory));
            })
            .catch(err => {
                console.error("Failed to load categories:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { categories, loading, error };
}