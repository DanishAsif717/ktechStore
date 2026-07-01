"use client";

import { useParams, notFound } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";
import { getVendorById, getProductsByVendor, formatPrice } from "@/lib/mock-data";
import { Star, MapPin, Mail, Phone, Calendar, Users, Package, ShoppingBag, Heart } from "lucide-react";

export default function VendorStorefrontPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;
  const vendor = getVendorById(vendorId);

  if (!vendor) notFound();

  const vendorProducts = getProductsByVendor(vendorId);

  return (
    <div>
      <div className={`bg-gradient-to-r ${vendor.banner} h-48 md:h-64 relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6">
          <div className="flex items-end gap-6">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl shadow-xl flex items-center justify-center text-5xl md:text-6xl border-4 border-white -mb-10">
              {vendor.logo}
            </div>
            <div className="mb-1 text-white hidden md:block">
              <h1 className="text-3xl font-bold">{vendor.shopName}</h1>
              <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span>{vendor.rating}</span>
                <span className="mx-1">·</span>
                <span>{vendor.totalSales.toLocaleString()} sales</span>
                <span className="mx-1">·</span>
                <span>{vendor.followers.toLocaleString()} followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-14 pb-8 md:hidden">
          <h1 className="text-2xl font-bold text-foreground">{vendor.shopName}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span>{vendor.rating}</span>
            <span>·</span>
            <span>{vendor.totalSales.toLocaleString()} sales</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-foreground">Products</h2>
              <span className="text-sm text-muted">({vendorProducts.length} items)</span>
            </div>
            {vendorProducts.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-xl">
                <Package className="h-12 w-12 text-border mx-auto mb-3" />
                <p className="text-muted font-medium">No products yet</p>
                <p className="text-sm text-muted mt-1">This vendor hasn&apos;t added any products.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {vendorProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">About the Store</h3>
              <p className="text-sm text-muted leading-relaxed">{vendor.description}</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <MapPin className="w-4 h-4 text-primary" />
                  {vendor.address}
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Mail className="w-4 h-4 text-primary" />
                  {vendor.email}
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Phone className="w-4 h-4 text-primary" />
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="w-4 h-4 text-primary" />
                  Joined {vendor.joinedDate}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Store Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary-light rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-foreground">{vendor.totalProducts}</div>
                  <div className="text-xs text-muted">Products</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-xl">
                  <Users className="w-5 h-5 text-accent mx-auto mb-1" />
                  <div className="text-lg font-bold text-foreground">{vendor.followers.toLocaleString()}</div>
                  <div className="text-xs text-muted">Followers</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Follow
              </button>
              <button className="flex-1 border border-border text-foreground font-medium py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors text-sm">
                Contact
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.categories.map(cat => (
                  <span key={cat} className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
