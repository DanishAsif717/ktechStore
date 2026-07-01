import Link from "next/link";
import Hero from "@/components/shared/Hero";
import ProductCard from "@/components/shared/ProductCard";
import CategoryCard from "@/components/shared/CategoryCard";
import VendorCard from "@/components/shared/VendorCard";
import { products, categories, vendors, formatPrice, getDiscountedProducts } from "@/lib/mock-data";

export default function HomePage() {
  const featured = products.filter(p => p.isFeatured).slice(0, 8);
  const topVendors = vendors.filter(v => v.status === "approved").slice(0, 4);
  const deals = getDiscountedProducts().slice(0, 4);

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: "🚚", title: "Free Delivery", desc: "Orders over $50" },
            { icon: "🛡️", title: "Quality Guarantee", desc: "100% satisfaction" },
            { icon: "🔄", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "💳", title: "Secure Payment", desc: "100% safe checkout" },
          ].map(f => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-4 md:p-6 text-center hover:shadow-md transition-shadow">
              <span className="text-3xl md:text-4xl">{f.icon}</span>
              <h3 className="font-semibold text-foreground mt-2 text-sm md:text-base">{f.title}</h3>
              <p className="text-xs md:text-sm text-muted mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Products</h2>
              <p className="text-muted mt-1">Hand-picked top products from our vendors</p>
            </div>
            <Link href="/products" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} showVendor />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-muted mt-1">Browse products across all categories</p>
          </div>
          <Link href="/categories" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
            All Categories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {deals.length > 0 && (
        <section className="bg-gradient-to-r from-accent/10 to-accent/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">🔥 Best Deals</h2>
                <p className="text-muted mt-1">Limited time offers you don&apos;t want to miss</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {deals.map(product => (
                <ProductCard key={product.id} product={product} showVendor />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Top Vendors</h2>
              <p className="text-muted mt-1">Shop from our trusted sellers</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topVendors.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start Selling on KTechMarket
          </h2>
          <p className="text-primary-light text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of vendors and reach thousands of customers. Set up your store in minutes.
          </p>
          <Link
            href="/vendor/register"
            className="inline-flex items-center gap-2 bg-accent text-white font-medium px-8 py-3.5 rounded-xl hover:bg-accent-dark transition-colors"
          >
            Become a Vendor Today
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
