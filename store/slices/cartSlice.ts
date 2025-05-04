import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CartShoe } from "@models/shoe";

// { id: "", name: "", image: "", size: 0, price: 0, quantity: 0}
export interface CartState {
  shoes: CartShoe[];
  totalAmount: number;
}

const initialState: CartState = {
  shoes: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addShoesToCart: (state, action: PayloadAction<CartShoe>) => {
      state.shoes = [...state.shoes, action.payload];
      state.totalAmount += action.payload.price;
    },
  },
});

export const { addShoesToCart } = cartSlice.actions;
export default cartSlice.reducer;
