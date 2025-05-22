import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stripeApi = createApi({
  reducerPath: "stripeApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_STRIPE_URL }),
  endpoints: (builder) => ({
    fetchPublishableKey: builder.query<any, void>({
      query: () => "/stripe-key",
    }),
    initPayment: builder.mutation<any, void>({
      query: () => ({
        url: "/payment-sheet",
        method: "POST",
      }),
    }),
  }),
});

export const { useFetchPublishableKeyQuery, useInitPaymentMutation } =
  stripeApi;
