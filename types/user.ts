import { Cart } from "@models/cart";
import { Address } from "@models/address";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  location?: Address;
  favoritesIds: string[];
  seenNotifsIds: string[];
  cart: Cart;
}

export interface UserFormValues {
  email: string;
  fullName?: string;
  location?: Address;
}
