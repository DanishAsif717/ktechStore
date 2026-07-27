"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/shared/ProductCard";
import VendorCard from "@/components/shared/VendorCard";
import EmptyState from "@/components/shared/EmptyState";
import { searchProducts } from "@/lib/services/product.service";
import { searchVendors } from "@/lib/services/vendor.service";
import { Search, Package, Store, RefreshCw, AlertCircle } from "lucide-react";
import type { Product, Vendor } from "@/types";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ products: Product[]; vendors: Vendor[] }>({ products: [], vendors: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], vendors: [] });
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      searchProducts(query),
      searchVendors(query),
    ])
      .then(([products, vendors]) => {
        if (!cancelled) setResults({ products, vendors });
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Search failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="text-center">
        <Search className="h-16 w-16 text-border mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Search</h1>
        <p className="text-muted">Type in the search bar above to find products and vendors.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-muted font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm font-medium mt-4"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="h-8 w-96 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Search Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-muted mt-1">
          Found {results.products.length} products and {results.vendors.length} vendors
        </p>
      </div>

      {results.products.length === 0 && results.vendors.length === 0 ? (
        <EmptyState
          type="search"
          title="No Results Found"
          message={`We couldn't find anything for "${query}". Try different keywords.`}
          actionLabel="Browse All Products"
          actionHref="/products"
        />
      ) : (
        <div className="space-y-12">
          {results.products.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Products ({results.products.length})</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {results.products.map(product => (
                  <ProductCard key={product.id} product={product} showVendor />
                ))}
              </div>
            </section>
          )}

          {results.vendors.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Store className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Vendors ({results.vendors.length})</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {results.vendors.map(vendor => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
}
