import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-light via-white to-primary-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Fresh Groceries Delivered Daily
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Fresh &{" "}
              <span className="text-primary">Organic</span>
              <br />
              Groceries for You
            </h1>
            <p className="text-lg text-muted max-w-lg">
              Shop the freshest fruits, vegetables, dairy, and more. Free delivery on orders over $50!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 border-2 border-border text-foreground font-medium px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-colors"
              >
                Browse Categories
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-xs text-muted">Products</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5K+</div>
                <div className="text-xs text-muted">Happy Customers</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2hr</div>
                <div className="text-xs text-muted">Delivery</div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {["🥬", "🍎", "🥕", "🥑"].map((emoji, i) => (
                    <div key={i} className="w-28 h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center text-5xl transform hover:scale-110 transition-transform">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
