import Link from "next/link";
import { ShoppingBag, Heart, PackageSearch, Store } from "lucide-react";

interface EmptyStateProps {
  type?: "cart" | "wishlist" | "products" | "orders" | "search";
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  type = "products",
  title,
  message,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const defaults: Record<string, { icon: React.ReactNode; title: string; message: string; actionLabel: string; actionHref: string }> = {
    cart: {
      icon: <ShoppingBag className="h-16 w-16" />,
      title: "Your Cart is Empty",
      message: "Looks like you haven't added anything yet.",
      actionLabel: "Start Shopping",
      actionHref: "/products",
    },
    wishlist: {
      icon: <Heart className="h-16 w-16" />,
      title: "Your Wishlist is Empty",
      message: "Save your favorite items here!",
      actionLabel: "Browse Products",
      actionHref: "/products",
    },
    products: {
      icon: <PackageSearch className="h-16 w-16" />,
      title: "No Products Found",
      message: "Try adjusting your filters or search query.",
      actionLabel: "View All Products",
      actionHref: "/products",
    },
    orders: {
      icon: <PackageSearch className="h-16 w-16" />,
      title: "No Orders Yet",
      message: "When customers place orders, they will appear here.",
      actionLabel: "Back to Dashboard",
      actionHref: "/vendor/dashboard",
    },
    search: {
      icon: <PackageSearch className="h-16 w-16" />,
      title: "No Results Found",
      message: "Try searching with different keywords.",
      actionLabel: "Browse All Products",
      actionHref: "/products",
    },
  };

  const d = defaults[type];
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <div className="text-border mx-auto mb-6 flex justify-center">
        {d.icon}
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title || d.title}</h2>
      <p className="text-muted mb-8">{message || d.message}</p>
      {(actionLabel || d.actionLabel) && (
        <Link
          href={actionHref || d.actionHref}
          className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          {actionLabel || d.actionLabel}
        </Link>
      )}
    </div>
  );
}
