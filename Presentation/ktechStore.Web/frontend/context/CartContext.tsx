"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.productId
            ? { ...i, quantity: Math.max(0, action.quantity) }
            : i
        ).filter(i => i.quantity > 0),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const saved = localStorage.getItem("ktech-cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            dispatch({ type: "ADD_ITEM", product: item.product });
            if (item.quantity > 1) {
              for (let i = 1; i < item.quantity; i++) {
                dispatch({ type: "ADD_ITEM", product: item.product });
              }
            }
          }
        }
      } catch { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ktech-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product) => dispatch({ type: "ADD_ITEM", product });
  const removeItem = (productId: number) => dispatch({ type: "REMOVE_ITEM", productId });
  const updateQuantity = (productId: number, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const getItemCount = () => state.items.reduce((sum, i) => sum + i.quantity, 0);
  const getSubtotal = () => state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount,
      getSubtotal,
      toggleCart,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
