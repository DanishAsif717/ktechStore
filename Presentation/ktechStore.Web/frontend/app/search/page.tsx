"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/shared/ProductCard";
import VendorCard from "@/components/shared/VendorCard";
import EmptyState from "@/components/shared/EmptyState";
import { searchProducts, searchVendors } from "@/lib/mock-data";
import { Search, Package, Store } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], vendors: [] };
    return {
      products: searchProducts(query),
      vendors: searchVendors(query),
    };
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
