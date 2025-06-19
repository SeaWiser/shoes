import { ImageSourcePropType } from "react-native";

export interface CartItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  size: number;
  price: number;
  quantity: number;
}

export interface Cart {
  shoes: CartItem[];
  totalAmount: number;
}
