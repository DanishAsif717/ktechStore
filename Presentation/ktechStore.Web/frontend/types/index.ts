export interface Vendor {
  id: string;
  shopName: string;
  logo: string;
  banner: string;
  description: string;
  categories: string[];
  rating: number;
  totalProducts: number;
  totalSales: number;
  joinedDate: string;
  status: "approved" | "pending" | "suspended";
  email: string;
  phone: string;
  address: string;
  followers: number;
}

export interface Product {
  id: number;
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  unit: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  discount?: number;
  tags: string[];
  specifications: { key: string; value: string }[];
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface Order {
  id: string;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  items: { productId: number; name: string; quantity: number; price: number }[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  shippingAddress: string;
}

export interface VendorDashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  rating: number;
  monthlyEarnings: { month: string; amount: number }[];
}
