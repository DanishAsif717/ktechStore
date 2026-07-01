"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, Heart, ChevronDown, Menu, X, Store, User } from "lucide-react";
import { categories, getAllCategories } from "@/lib/mock-data";

export default function Navbar() {
  const { getItemCount, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeMegaCat, setActiveMegaCat] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();
  const allCategories = getAllCategories();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:inline">KTech<span className="text-primary">Market</span></span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <div className="relative" ref={megaRef}>
                <button
                  onClick={() => setMegaOpen(!megaOpen)}
                  onMouseEnter={() => setMegaOpen(true)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                >
                  <Store className="w-4 h-4" />
                  Categories
                  <ChevronDown className={`w-3 h-3 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                </button>
                {megaOpen && (
                  <div
                    onMouseLeave={() => setMegaOpen(false)}
                    className="absolute top-full left-0 mt-1 w-[600px] bg-white border border-border rounded-xl shadow-xl grid grid-cols-3 gap-2 p-4"
                  >
                    {categories.map(cat => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setMegaOpen(false)}
                        onMouseEnter={() => setActiveMegaCat(cat.name)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <span className="text-2xl">{cat.image}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{cat.name}</p>
                          <p className="text-xs text-muted">{cat.productCount} products</p>
                        </div>
                      </Link>
                    ))}
                    <div className="col-span-3 border-t border-border pt-3 mt-1">
                      <Link
                        href="/categories"
                        onClick={() => setMegaOpen(false)}
                        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/products" className="px-3 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
                Products
              </Link>
              <Link href="/" className="px-3 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
                Deals
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && searchQuery.trim()) { window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`; } }}
                placeholder="Search across all vendors..."
                className="w-full border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-muted hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2 text-muted hover:text-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistItems.length > 0 ? "text-red-500 fill-red-500" : ""}`} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-muted hover:text-primary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <Link
              href="/vendor/register"
              className="hidden lg:inline-flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Store className="w-4 h-4" />
              Sell
            </Link>

            <Link
              href="/vendor/login"
              className="hidden sm:inline-flex items-center gap-1.5 border border-border text-muted hover:text-primary px-3 py-2 rounded-lg text-sm font-medium hover:border-primary transition-colors"
            >
              <User className="w-4 h-4" />
              Vendor
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-muted hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && searchQuery.trim()) { window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`; } }}
              placeholder="Search products..."
              className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="px-4 py-3 space-y-1">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 py-1">Categories</div>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <span>{cat.image}</span>
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
                All Products
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
                Wishlist
              </Link>
              <Link href="/vendor/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary-light rounded-lg transition-colors">
                Become a Vendor
              </Link>
              <Link href="/vendor/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
                Vendor Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
