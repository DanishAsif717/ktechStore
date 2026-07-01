"use client";

import { useParams, notFound } from "next/navigation";
import { useState, useMemo } from "react";
import ProductCard from "@/components/shared/ProductCard";
import { products, categories, getCategoryBySlug, getAllSubcategories, vendors, getVendorsByCategory } from "@/lib/mock-data";
import { SlidersHorizontal, X } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getCategoryBySlug(slug);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  if (!category) notFound();

  const subcategories = getAllSubcategories(category.name);
  const categoryVendors = getVendorsByCategory(category.name);

  const filtered = useMemo(() => {
    let result = products.filter(p => p.category === category.name);
    if (selectedSubcategory) result = result.filter(p => p.subcategory === selectedSubcategory);
    if (selectedVendor) result = result.filter(p => p.vendorId === selectedVendor);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    return result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });
  }, [category, selectedSubcategory, selectedVendor, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedSubcategory(null);
    setSelectedVendor(null);
    setPriceRange([0, 500]);
    setSortBy("default");
  };

  const hasFilters = selectedSubcategory || selectedVendor || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">{category.image}</span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            <p className="text-muted mt-1">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:w-60 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-primary hover:text-primary-dark">
                  Clear all
                </button>
              )}
              <button onClick={() => setShowFilters(false)} className="lg:hidden text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

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

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Vendor</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedVendor ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                >
                  All Vendors
                </button>
                {categoryVendors.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVendor(v.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedVendor === v.id ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-primary-light"}`}
                  >
                    {v.shopName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Price Range</h4>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>${priceRange[0]}</span>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={5}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 accent-primary"
                />
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <p className="text-sm text-muted">
                Showing <span className="font-medium text-foreground">{filtered.length}</span> products
              </p>
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

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🔍</span>
              <p className="text-muted font-medium mt-4">No products found matching your filters.</p>
              <button onClick={clearFilters} className="text-primary text-sm mt-2 hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
