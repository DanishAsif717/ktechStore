import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-light via-white to-primary-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About KTech Store</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Your trusted online grocery store delivering fresh, quality products right to your doorstep.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-semibold text-sm">Our Story</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">We Make Grocery Shopping Effortless</h2>
            <p className="text-muted leading-relaxed mb-4">
              Founded in 2024, KTech Store set out with a simple mission: to make fresh, quality groceries accessible to everyone with just a few clicks. What started as a small neighborhood delivery service has grown into a trusted online grocery platform serving thousands of happy customers.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              We partner directly with local farmers, trusted suppliers, and artisanal producers to bring you the freshest products at competitive prices. From farm-fresh produce to pantry staples, every item in our catalog is carefully selected to meet our quality standards.
            </p>
            <p className="text-muted leading-relaxed">
              Our commitment to sustainability means we use eco-friendly packaging and optimize our delivery routes to minimize our carbon footprint. We believe that convenient grocery shopping should also be responsible shopping.
            </p>
          </div>
          <div className="aspect-square bg-gradient-to-br from-primary-light to-white rounded-2xl flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              {["🌱", "🚚", "💚", "⭐"].map((emoji, i) => (
                <div key={i} className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center text-5xl">
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose Us</h2>
            <p className="text-muted mt-2">What sets KTech Store apart</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🥬", title: "Freshness Guaranteed", desc: "We source directly from local farms and suppliers to ensure the freshest products reach your table." },
              { icon: "⚡", title: "Lightning Fast Delivery", desc: "Most orders delivered within 2 hours. Schedule delivery at your convenience." },
              { icon: "🛡️", title: "Quality Promise", desc: "Not satisfied? We'll replace it or refund you. Your satisfaction is our priority." },
              { icon: "🌍", title: "Eco-Friendly", desc: "We use sustainable packaging and optimize routes to reduce our environmental impact." },
              { icon: "💰", title: "Best Prices", desc: "Competitive pricing with regular deals and discounts. More value for your money." },
              { icon: "💝", title: "Customer First", desc: "Our support team is available 24/7 to help you with any questions or concerns." },
            ].map(f => (
              <div key={f.title} className="text-center p-6">
                <span className="text-5xl block mb-4">{f.icon}</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Shopping?</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">Join thousands of happy customers and get fresh groceries delivered to your door.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-colors"
        >
          Start Shopping
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
