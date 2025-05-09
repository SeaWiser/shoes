import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@models/user";

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
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}.json`,
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
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `users/${id}.json`,
        method: "PATCH",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUserById", id, (draft) => {
            Object.assign(draft, patch);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useLazyGetUserQuery,
} = userApi;
