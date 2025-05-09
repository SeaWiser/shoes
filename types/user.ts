import { Cart } from "@models/cart";

export interface User {
  id: string;
  email: string;
  favoritesIds: string[];
  seenNotifsIds: string[];
  cart: Cart;
}
