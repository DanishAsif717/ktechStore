export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-light via-white to-primary-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Have a question, suggestion, or feedback? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Get in Touch</h2>
            <p className="text-muted mb-8">Fill out the form and we&apos;ll get back to you within 24 hours.</p>

            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                  <input
                    type="text"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                  <input
                    type="text"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                <input
                  type="text"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  rows={5}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Contact Information</h2>
            <p className="text-muted mb-8">Here are other ways to reach us.</p>

            <div className="space-y-6">
              {[
                {
                  icon: "📍",
                  title: "Address",
                  lines: ["123 Grocery Lane", "Foodville, FC 12345", "United States"],
                },
                {
                  icon: "📞",
                  title: "Phone",
                  lines: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
                },
                {
                  icon: "✉️",
                  title: "Email",
                  lines: ["hello@ktechstore.com", "support@ktechstore.com"],
                },
                {
                  icon: "🕐",
                  title: "Business Hours",
                  lines: ["Monday - Friday: 7:00 AM - 10:00 PM", "Saturday - Sunday: 8:00 AM - 9:00 PM"],
                },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.lines.map((line, i) => (
                      <p key={i} className="text-sm text-muted">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
