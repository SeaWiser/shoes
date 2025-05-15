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
    getUserById: builder.query<User, { userId: string; token: string }>({
      query: ({ userId, token }) => `users/${userId}.json?auth=${token}`,
    }),
    createUser: builder.mutation({
      query: ({ user, token, id }) => ({
        url: `users/${id}.json?auth=${token}`,
        method: "PUT",
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, token, ...patch }) => ({
        url: `users/${userId}.json?auth=${token}`,
        method: "PATCH",
        body: patch,
      }),
      async onQueryStarted(
        { userId, token, ...patch },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          userApi.util.updateQueryData(
            "getUserById",
            { userId, token },
            (draft) => {
              Object.assign(draft, patch);
            },
          ),
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
