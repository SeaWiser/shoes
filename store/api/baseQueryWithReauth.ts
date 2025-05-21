import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import * as SecureStore from "expo-secure-store";
import { setToken, setUserId } from "../slices/authSlice";
import { RefreshTokenResponse } from "./authApi";

const baseQuery = fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL });

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. Execute query or mutation
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // 2. Get refreshed token
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (refreshToken) {
      // 3. Refresh the tokens
      const refreshResult = (await baseQuery(
        {
          url:
            String(process.env.EXPO_PUBLIC_FIREBASE_TOKEN_URL) +
            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
          method: "POST",
          body: {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          },
        },
        api,
        extraOptions,
      )) as { data: RefreshTokenResponse };
      if (refreshResult.data) {
        // 4. Store the new tokens
        api.dispatch(setToken(refreshResult.data.id_token));
        SecureStore.setItemAsync(
          "refreshToken",
          refreshResult.data.refresh_token,
        );
        // 5. Edit param args with new token in the url
        if (typeof args !== "string" && args.url) {
          args.url =
            args.url.split("auth=")[0] + `auth=${refreshResult.data.id_token}`;
          // 6. Re-try initial query or mutation with the new token
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        api.dispatch(setToken(undefined));
        api.dispatch(setUserId(undefined));
        SecureStore.deleteItemAsync("refreshToken");
      }
    } else {
      api.dispatch(setToken(undefined));
      api.dispatch(setUserId(undefined));
    }
  }

  return result;
};
