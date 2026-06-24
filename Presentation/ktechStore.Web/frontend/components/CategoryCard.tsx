import Link from "next/link";
import type { Category } from "@/lib/data";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-8">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {getCategoryEmoji(category.id)}
        </span>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted mt-1">{category.productCount} Products</p>
      </div>
    </Link>
  );
}

function getCategoryEmoji(id: number): string {
  const emojis: Record<number, string> = {
    1: "🥬", 2: "🥛", 3: "🥩", 4: "🥐", 5: "🧃", 6: "🍿", 7: "🍝", 8: "🧹",
  };
  return emojis[id] || "🛒";
}
