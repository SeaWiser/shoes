import { ImageSourcePropType } from "react-native";
import { ShoeSize } from "@models/shoe-size";

export interface ShoeItem {
  color: string;
  image: ImageSourcePropType;
  sizes: number[];
}

export interface ShoeStock {
  id: string;
  name: string;
  gender: "m" | "f" | "u"; // male, femme, unisexe
  items: ShoeItem[];
  price: number;
  description: string;
  new?: boolean;
}

export interface Shoe {
  brand: string;
  stock: ShoeStock[];
}
