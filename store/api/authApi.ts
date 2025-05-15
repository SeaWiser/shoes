import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AuthValues {
  email: string;
  password: string;
  endpoint: "signUp" | "signInWithPassword";
}

interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  error?: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_AUTH_URL }),
  endpoints: (builder) => ({
    sign: builder.mutation<AuthResponse, AuthValues>({
      query: ({ endpoint, email, password }) => ({
        url: `:${endpoint}?key=${process.env.EXPO_PUBLIC_FIREBASE_API_KEY}`,
        method: "POST",
        body: { email, password, returnSecureToken: true },
      }),
    }),
    refreshToken: builder.mutation<
      { access_token: string; expires_in: string; token_type: string },
      string
    >({
      query: (refreshToken) => ({
        url:
          String(process.env.EXPO_PUBLIC_FIREBASE_TOKEN_URL) +
          process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        method: "POST",
        body: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
      }),
    }),
  }),
});

export const { useSignMutation, useRefreshTokenMutation } = authApi;
