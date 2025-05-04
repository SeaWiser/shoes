import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FavoritesState {
  favoritesShoesIds: string[];
}

const initialState: FavoritesState = {
  favoritesShoesIds: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      state.favoritesShoesIds = [...state.favoritesShoesIds, action.payload];
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favoritesShoesIds = state.favoritesShoesIds.filter(
        (currentId) => currentId !== action.payload,
      );
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
