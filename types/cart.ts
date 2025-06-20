import { ShoeSize } from "@models/shoe-size";

export interface CartShoe {
  id: string;
  name: string;
  image: string; // ✅ Garder string pour l'URL/path
  size: ShoeSize;
  price: number;
  quantity: number;
}

export interface Cart {
  shoes: CartShoe[];
  totalAmount: number;
}
