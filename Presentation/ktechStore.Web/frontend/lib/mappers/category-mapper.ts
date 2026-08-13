import type { CategoryApiResponse } from "@/types/api";
import type { Category } from "@/types";

function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function mapApiCategoryToCategory(c: CategoryApiResponse): Category {
    const slug = slugify(c.name);
    return {
        id: c.id,
        name: c.name,
        description: c.description ?? "",
        slug:slug,
    };
}