export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getProductEmoji(category: string): string {
  const map: Record<string, string> = {
    "Grocery": "🍌",
    "Clothes": "👕",
    "Car Parts": "🔧",
    "Electronics": "⚡",
    "Home & Kitchen": "🏠",
    "Sports": "💪",
  };
  return map[category] || "🛒";
}

export function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    "grocery": "🥬",
    "clothes": "👕",
    "car-parts": "🔧",
    "electronics": "⚡",
    "home-kitchen": "🏠",
    "sports": "💪",
  };
  return map[slug] || "🛒";
}

export function generateOrderId(): string {
  return `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
