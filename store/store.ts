import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./slices/favoritesSlice";
import notificationsReducer from "./slices/notificationsSlice";
import cartReducer from "./slices/cartSlice";
import { favoritesApi } from "./api/favoritesApi";
import { notificationsApi } from "./api/notificationsApi";
import { rtkQueryErrorMiddleware } from "./middlewares/errorMiddleware";
import errorReducer from "./slices/errorSlice";
import authReducer from "./slices/authSlice";
import { stripeApi } from "./api/stripe";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    notifications: notificationsReducer,
    cart: cartReducer,
    error: errorReducer,
    auth: authReducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [stripeApi.reducerPath]: stripeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(favoritesApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(rtkQueryErrorMiddleware)
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(stripeApi.middleware),
  enhancers: (getDefaultEnhancer) =>
    __DEV__
      ? getDefaultEnhancer().concat(
          require("../ReactotronConfig").default.createEnhancer(),
        )
      : getDefaultEnhancer(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
