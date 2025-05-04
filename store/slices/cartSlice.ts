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
    removeShoesFromCart: (state, action: PayloadAction<{ id: string }>) => {
      const shoesToRemove = state.shoes.find(
        (shoes) => shoes.id === action.payload.id,
      );
      if (shoesToRemove) {
        state.shoes = state.shoes.filter(
          (shoes) => shoes.id !== shoesToRemove.id,
        );
        state.totalAmount -= shoesToRemove.price * shoesToRemove.quantity;
      }
    },
    increaseQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const foundShoe = state.shoes.find(
        (shoe) => shoe.id === action.payload.id,
      );
      if (foundShoe) {
        const index = state.shoes.indexOf(foundShoe);
        state.shoes[index].quantity += 1;
        state.totalAmount += foundShoe.price;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const foundShoe = state.shoes.find(
        (shoe) => shoe.id === action.payload.id,
      );
      if (foundShoe) {
        const index = state.shoes.indexOf(foundShoe);

        if (state.shoes[index].quantity > 1) {
          state.shoes[index].quantity -= 1;
          state.totalAmount -= foundShoe.price;
        }
      }
    },
  },
});

export const {
  addShoesToCart,
  removeShoesFromCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
