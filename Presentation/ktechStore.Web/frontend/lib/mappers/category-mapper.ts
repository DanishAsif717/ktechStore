import type { CategoryApiResponse } from "@/types/api";
import type { Category } from "@/types";
import { getCategoryEmoji } from "@/lib/utils";

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
        slug,
        description: c.description ?? "",
        image: getCategoryEmoji(slug),
        productCount: 0,   
        icon: getCategoryEmoji(slug),
    };
}