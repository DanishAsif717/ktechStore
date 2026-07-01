import Link from "next/link";
import type { Vendor } from "@/types";
import { Star, MapPin } from "lucide-react";

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className={`h-20 bg-gradient-to-r ${vendor.banner} relative`}>
        <div className="absolute -bottom-8 left-4 w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl border-2 border-white">
          {vendor.logo}
        </div>
      </div>
      <div className="pt-10 p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {vendor.shopName}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-sm font-medium text-foreground">{vendor.rating}</span>
          <span className="text-xs text-muted">({vendor.totalSales.toLocaleString()} sales)</span>
        </div>
        <p className="text-xs text-muted mt-1 line-clamp-2">{vendor.description}</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted">
          <MapPin className="w-3 h-3" />
          {vendor.categories.slice(0, 2).join(", ")}
        </div>
      </div>
    </Link>
  );
}
