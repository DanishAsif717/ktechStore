"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "TOGGLE"; product: Product }
  | { type: "REMOVE"; productId: number }
  | { type: "CLEAR" };

interface WishlistContextType {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  isWishlisted: (productId: number) => boolean;
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.items.find(i => i.id === action.product.id);
      if (exists) {
        return { items: state.items.filter(i => i.id !== action.product.id) };
      }
      return { items: [...state.items, action.product] };
    }
    case "REMOVE":
      return { items: state.items.filter(i => i.id !== action.productId) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem("ktech-wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((p: Product) => dispatch({ type: "TOGGLE", product: p }));
        }
      } catch { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ktech-wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const toggleItem = (product: Product) => dispatch({ type: "TOGGLE", product });
  const removeItem = (productId: number) => dispatch({ type: "REMOVE", productId });
  const clearWishlist = () => dispatch({ type: "CLEAR" });
  const isWishlisted = (productId: number) => state.items.some(i => i.id === productId);

  return (
    <WishlistContext.Provider value={{ items: state.items, toggleItem, removeItem, clearWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
