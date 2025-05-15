import { configureStore } from "@reduxjs/toolkit";
import reactotron from "../ReactotronConfig";
import favoritesReducer from "./slices/favoritesSlice";
import notificationsReducer from "./slices/notificationsSlice";
import cartReducer from "./slices/cartSlice";
import { favoritesApi } from "./api/favoritesApi";
import { notificationsApi } from "./api/notificationsApi";
import { userApi } from "./api/userApi";
import { rtkQueryErrorMiddleware } from "./middlewares/errorMiddleware";
import errorReducer from "./slices/errorSlice";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    notifications: notificationsReducer,
    cart: cartReducer,
    error: errorReducer,
    auth: authReducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(favoritesApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(userApi.middleware)
      .concat(rtkQueryErrorMiddleware)
      .concat(authApi.middleware),
  enhancers: (getDefaultEnhancer) =>
    getDefaultEnhancer().concat(reactotron.createEnhancer()),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
