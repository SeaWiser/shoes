import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  id: string;
  email: string;
}

interface UsersResponse {
  [key: string]: Omit<User, "id">;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getUser: builder.query<User, { email: string }>({
      query: () => "users.json",
      transformResponse: (response: UsersResponse, meta, { email }) => {
        let user = {} as User;
        for (const key in response) {
          if (response[key].email === email) {
            user = {
              id: key,
              ...response[key],
            };
          }
        }
        return user;
      },
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "users.json",
        method: "POST",
        body: user,
      }),
      transformResponse: (response) => {
        return { id: response.name };
      },
    }),
  }),
});

export const { useGetUserQuery, useCreateUserMutation, useLazyGetUserQuery } =
  userApi;
