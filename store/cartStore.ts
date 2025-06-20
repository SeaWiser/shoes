import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartShoe, Cart } from "@models/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CartState {
  shoes: CartShoe[];
  totalAmount: number;
  addShoe: (shoe: CartShoe) => void;
  removeShoe: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  syncCart: (cart: Cart) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      shoes: [],
      totalAmount: 0,

      addShoe: (shoe: CartShoe) =>
        set((state) => {
          const existingShoeIndex = state.shoes.findIndex(
            (s) => s.id === shoe.id && s.size === shoe.size,
          );

          if (existingShoeIndex >= 0) {
            const updatedShoes = [...state.shoes];
            updatedShoes[existingShoeIndex].quantity += shoe.quantity;

            return {
              shoes: updatedShoes,
              totalAmount: state.totalAmount + shoe.price * shoe.quantity,
            };
          } else {
            return {
              shoes: [...state.shoes, shoe],
              totalAmount: state.totalAmount + shoe.price * shoe.quantity,
            };
          }
        }),

      removeShoe: (id) =>
        set((state) => {
          const shoeToRemove = state.shoes.find((shoe) => shoe.id === id);
          if (shoeToRemove) {
            return {
              shoes: state.shoes.filter((shoe) => shoe.id !== id),
              totalAmount:
                state.totalAmount - shoeToRemove.price * shoeToRemove.quantity,
            };
          }
          return state;
        }),

      increaseQuantity: (id) =>
        set((state) => ({
          shoes: state.shoes.map((shoe) =>
            shoe.id === id ? { ...shoe, quantity: shoe.quantity + 1 } : shoe,
          ),
          totalAmount:
            state.totalAmount +
            (state.shoes.find((s) => s.id === id)?.price || 0),
        })),

      decreaseQuantity: (id) =>
        set((state) => {
          const shoe = state.shoes.find((s) => s.id === id);
          if (shoe && shoe.quantity > 1) {
            return {
              shoes: state.shoes.map((s) =>
                s.id === id ? { ...s, quantity: s.quantity - 1 } : s,
              ),
              totalAmount: state.totalAmount - shoe.price,
            };
          }
          return state;
        }),

      syncCart: (cart: Cart) =>
        set({
          shoes: cart.shoes || [],
          totalAmount: cart.totalAmount || 0,
        }),

      clearCart: () => set({ shoes: [], totalAmount: 0 }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
