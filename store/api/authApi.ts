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

const errorMessages = {
  EMAIL_EXISTS: "Cet email est déjà utilisé",
  INVALID_LOGIN_CREDENTIALS: "Ces identifiants sont incorrects",
};

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
      transformErrorResponse: (response: any) => {
        const code = response?.data?.error?.message as string;
        console.log(response);
        return {
          error:
            errorMessages[code as keyof typeof errorMessages] ||
            "Une erreur est survenue. Veuillez ré-essayer ultérieurement",
        };
      },
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
