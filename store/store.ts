import { configureStore } from "@reduxjs/toolkit";
import reactotron from "../ReactotronConfig";
import favoritesReducer from "./slices/favoritesSlice";
import notificationsReducer from "./slices/notificationsSlice";
import cartReducer from "./slices/cartSlice";
import { favoritesApi } from "./api/favoritesApi";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    notifications: notificationsReducer,
    cart: cartReducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(favoritesApi.middleware),
  enhancers: (getDefaultEnhancer) =>
    getDefaultEnhancer().concat(reactotron.createEnhancer()),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
