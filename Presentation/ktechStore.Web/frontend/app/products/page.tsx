"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

import { SlidersHorizontal, X, RefreshCw, AlertCircle } from "lucide-react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const { products, loading, error } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedSubcategory) result = result.filter(p => p.subcategory === selectedSubcategory);
    if (selectedVendor) result = result.filter(p => p.vendorId === selectedVendor);
    return result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });
  }, [products, selectedCategory, selectedSubcategory, selectedVendor, sortBy]);

  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const subs = new Set<string>();
    products
      .filter(p => p.category === selectedCategory)
      .forEach(p => subs.add(p.subcategory));
    return Array.from(subs).sort();
  }, [products, selectedCategory]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedVendor(null);
    setSelectedSubcategory(null);
    setSortBy("default");
  };

  const hasFilters = selectedCategory || selectedVendor || selectedSubcategory;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Failed to load products</h2>
          <p className="text-muted mb-6 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Products</h1>
        <p className="text-muted mt-1">Browse our wide selection from multiple vendors</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className={`w-full md:w-56 flex-shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-primary hover:text-primary-dark">Clear</button>
              )}
              <button onClick={() => setShowFilters(false)} className="md:hidden text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Category</h4>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.slug}>
                      <button
                        onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory(null); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.name ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedCategory && subcategories.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Subcategory</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedSubcategory ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                  >
                    All
                  </button>
                  {subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedSubcategory === sub ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              {loading ? (
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              ) : (
                <p className="text-sm text-muted">
                  Showing <span className="font-medium text-foreground">{filtered.length}</span> products
                </p>
              )}
            </div>
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

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🔍</span>
              <p className="text-muted font-medium mt-4">No products found.</p>
              <button onClick={clearFilters} className="text-primary text-sm mt-2 hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} showVendor />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
