"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products, categories, type Category } from "@/lib/data";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");

  const filtered = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name": return a.name.localeCompare(b.name);
      case "rating": return b.rating - a.rating;
      default: return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Products</h1>
        <p className="text-muted mt-1">Browse our wide selection of fresh groceries</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
            <h3 className="font-semibold text-foreground mb-3">Categories</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === null ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat: Category) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.id ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted">
              Showing <span className="font-medium text-foreground">{sorted.length}</span> products
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground outline-none focus:border-primary"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🔍</span>
              <p className="text-muted font-medium mt-4">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {sorted.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
