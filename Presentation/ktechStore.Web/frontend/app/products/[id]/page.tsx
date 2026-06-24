"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getProductBySlug, getCategoryById, getProductsByCategory, formatPrice } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const product = getProductBySlug(slug);
  const { addItem, openCart } = useCart();

  if (!product) notFound();

  const category = getCategoryById(product.categoryId);
  const related = getProductsByCategory(product.categoryId)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/categories/${category.slug}`} className="hover:text-primary transition-colors">{category.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-gradient-to-br from-primary-light to-white rounded-2xl flex items-center justify-center">
          <span className="text-[12rem]">{getProductEmoji(product.categoryId)}</span>
        </div>

        <div className="space-y-6">
          <div>
            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="inline-block text-xs font-medium text-primary bg-primary-light px-3 py-1 rounded-full mb-3 hover:bg-primary hover:text-white transition-colors"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-accent" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount && (
              <span className="text-sm font-medium text-white bg-accent px-2.5 py-0.5 rounded-lg">-{product.discount}%</span>
            )}
          </div>

          <p className="text-muted leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted">Unit:</span>
              <span className="font-medium text-foreground">{product.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted">Availability:</span>
              {product.inStock ? (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  In Stock
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full sm:w-auto bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function getProductEmoji(categoryId: number): string {
  const emojis: Record<number, string> = { 1: "🍌", 2: "🥛", 3: "🍗", 4: "🥖", 5: "🧃", 6: "🍪", 7: "🍚", 8: "🧴" };
  return emojis[categoryId] || "🛒";
}
