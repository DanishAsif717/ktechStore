export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: number;
  unit: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  discount?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
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

export const categories: Category[] = [
  { id: 1, name: "Fruits & Vegetables", slug: "fruits-vegetables", description: "Fresh organic fruits and vegetables sourced directly from local farms", image: "/categories/fruits.jpg", productCount: 24 },
  { id: 2, name: "Dairy & Eggs", slug: "dairy-eggs", description: "Farm-fresh dairy products and free-range eggs", image: "/categories/dairy.jpg", productCount: 18 },
  { id: 3, name: "Meat & Poultry", slug: "meat-poultry", description: "Premium quality meat and poultry products", image: "/categories/meat.jpg", productCount: 15 },
  { id: 4, name: "Bakery", slug: "bakery", description: "Freshly baked bread, pastries, and cakes", image: "/categories/bakery.jpg", productCount: 20 },
  { id: 5, name: "Beverages", slug: "beverages", description: "Refreshing drinks, juices, and more", image: "/categories/beverages.jpg", productCount: 30 },
  { id: 6, name: "Snacks", slug: "snacks", description: "Chips, cookies, and all your favorite snacks", image: "/categories/snacks.jpg", productCount: 35 },
  { id: 7, name: "Pantry Staples", slug: "pantry-staples", description: "Rice, pasta, oils, and cooking essentials", image: "/categories/pantry.jpg", productCount: 28 },
  { id: 8, name: "Household", slug: "household", description: "Cleaning supplies and household essentials", image: "/categories/household.jpg", productCount: 22 },
];

export const products: Product[] = [
  { id: 1, name: "Organic Bananas", slug: "organic-bananas", description: "Fresh organic bananas sourced from sustainable farms. Rich in potassium and naturally sweet.", price: 1.99, originalPrice: 2.49, image: "/products/bananas.jpg", categoryId: 1, unit: "bunch", inStock: true, rating: 4.5, reviewCount: 128, isFeatured: true, discount: 20 },
  { id: 2, name: "Fresh Avocados", slug: "fresh-avocados", description: "Ripe and creamy avocados, perfect for guacamole or toast.", price: 2.99, image: "/products/avocados.jpg", categoryId: 1, unit: "each", inStock: true, rating: 4.3, reviewCount: 94, isFeatured: true },
  { id: 3, name: "Whole Milk", slug: "whole-milk", description: "Farm-fresh whole milk from grass-fed cows. Pasteurized and homogenized.", price: 3.49, image: "/products/milk.jpg", categoryId: 2, unit: "gallon", inStock: true, rating: 4.7, reviewCount: 210 },
  { id: 4, name: "Free-Range Eggs (12pk)", slug: "free-range-eggs", description: "Grade A free-range eggs from cage-free hens. Rich in protein and omega-3s.", price: 4.99, image: "/products/eggs.jpg", categoryId: 2, unit: "pack", inStock: true, rating: 4.6, reviewCount: 185, isFeatured: true },
  { id: 5, name: "Chicken Breast", slug: "chicken-breast", description: "Boneless skinless chicken breast. Lean, tender, and perfect for grilling.", price: 8.99, image: "/products/chicken.jpg", categoryId: 3, unit: "lb", inStock: true, rating: 4.4, reviewCount: 67 },
  { id: 6, name: "Ground Beef 80/20", slug: "ground-beef", description: "Premium ground beef, 80% lean 20% fat. Great for burgers and meatballs.", price: 6.99, image: "/products/ground-beef.jpg", categoryId: 3, unit: "lb", inStock: true, rating: 4.2, reviewCount: 73 },
  { id: 7, name: "Sourdough Bread", slug: "sourdough-bread", description: "Artisan sourdough bread baked fresh daily. Crispy crust and soft interior.", price: 5.49, image: "/products/sourdough.jpg", categoryId: 4, unit: "loaf", inStock: true, rating: 4.8, reviewCount: 156, isFeatured: true },
  { id: 8, name: "Chocolate Chip Cookies", slug: "chocolate-chip-cookies", description: "Freshly baked chocolate chip cookies. Soft, chewy, and loaded with chocolate.", price: 3.99, image: "/products/cookies.jpg", categoryId: 4, unit: "pack", inStock: true, rating: 4.5, reviewCount: 89 },
  { id: 9, name: "Orange Juice", slug: "orange-juice", description: "Freshly squeezed orange juice. No added sugar, no preservatives.", price: 4.49, image: "/products/orange-juice.jpg", categoryId: 5, unit: "bottle", inStock: true, rating: 4.6, reviewCount: 134 },
  { id: 10, name: "Green Tea", slug: "green-tea", description: "Premium Japanese green tea leaves. Rich in antioxidants.", price: 6.99, image: "/products/green-tea.jpg", categoryId: 5, unit: "box", inStock: true, rating: 4.3, reviewCount: 56 },
  { id: 11, name: "Potato Chips", slug: "potato-chips", description: "Crispy kettle-cooked potato chips. Sea salt flavor.", price: 2.99, image: "/products/chips.jpg", categoryId: 6, unit: "bag", inStock: true, rating: 4.1, reviewCount: 203 },
  { id: 12, name: "Mixed Nuts", slug: "mixed-nuts", description: "Roasted and salted mixed nuts. Great healthy snack option.", price: 7.99, image: "/products/nuts.jpg", categoryId: 6, unit: "bag", inStock: true, rating: 4.4, reviewCount: 78 },
  { id: 13, name: "Basmati Rice (5lb)", slug: "basmati-rice", description: "Premium aged basmati rice. Long grain, aromatic, and fluffy.", price: 9.99, image: "/products/rice.jpg", categoryId: 7, unit: "bag", inStock: true, rating: 4.7, reviewCount: 112 },
  { id: 14, name: "Extra Virgin Olive Oil", slug: "olive-oil", description: "Cold-pressed extra virgin olive oil from Italy.", price: 12.99, image: "/products/olive-oil.jpg", categoryId: 7, unit: "bottle", inStock: true, rating: 4.5, reviewCount: 95, isFeatured: true },
  { id: 15, name: "Organic Strawberries", slug: "organic-strawberries", description: "Sweet and juicy organic strawberries. Picked at peak ripeness.", price: 4.99, originalPrice: 5.99, image: "/products/strawberries.jpg", categoryId: 1, unit: "pack", inStock: true, rating: 4.6, reviewCount: 147, discount: 17 },
  { id: 16, name: "Greek Yogurt", slug: "greek-yogurt", description: "Creamy Greek yogurt, high in protein. Plain, no added sugar.", price: 5.49, image: "/products/yogurt.jpg", categoryId: 2, unit: "tub", inStock: true, rating: 4.3, reviewCount: 88 },
  { id: 17, name: "Salmon Fillet", slug: "salmon-fillet", description: "Fresh Atlantic salmon fillet. Rich in omega-3 fatty acids.", price: 14.99, image: "/products/salmon.jpg", categoryId: 3, unit: "lb", inStock: true, rating: 4.8, reviewCount: 62 },
  { id: 18, name: "Croissants (4pk)", slug: "croissants", description: "Buttery, flaky French-style croissants baked fresh.", price: 4.49, image: "/products/croissants.jpg", categoryId: 4, unit: "pack", inStock: false, rating: 4.7, reviewCount: 103 },
  { id: 19, name: "Sparkling Water", slug: "sparkling-water", description: "Natural sparkling mineral water. Zero calories, crisp taste.", price: 3.99, image: "/products/sparkling-water.jpg", categoryId: 5, unit: "6-pack", inStock: true, rating: 4.0, reviewCount: 45 },
  { id: 20, name: "Dark Chocolate Bar", slug: "dark-chocolate", description: "70% cacao dark chocolate. Smooth, rich, and ethically sourced.", price: 3.49, image: "/products/chocolate.jpg", categoryId: 6, unit: "bar", inStock: true, rating: 4.5, reviewCount: 134 },
];

export const testimonials: Testimonial[] = [
  { id: 1, name: "Sarah Johnson", avatar: "/avatars/sarah.jpg", content: "KTech Store has completely changed how I shop for groceries. The quality is outstanding and delivery is always on time!", rating: 5 },
  { id: 2, name: "Michael Chen", avatar: "/avatars/michael.jpg", content: "The freshest produce I've ever ordered online. Highly recommend the organic section!", rating: 5 },
  { id: 3, name: "Emily Rodriguez", avatar: "/avatars/emily.jpg", content: "Amazing selection of products and the prices are very competitive. My go-to grocery store now.", rating: 4 },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categoryId: number): Product[] {
  return products.filter(p => p.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getCategoryById(id: number): Category | undefined {
  return categories.find(c => c.id === id);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
