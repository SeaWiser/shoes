import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "@models/user";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface UsersResponse {
  [key: string]: Omit<User, "id">;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUser: builder.query<User, { email: string }>({
      query: () => "users.json",
      transformResponse: (response: UsersResponse, meta, {email}) => {
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
      query: ({userId, token}) => ({
        url: `users/${userId}.json?auth=${token}`,
      }),
    }),
    createUser: builder.mutation({
      query: ({user, token, id}) => ({
        url: `users/${id}.json?auth=${token}`,
        method: "PUT",
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: ({userId, token, ...patch}) => ({
        url: `users/${userId}.json?auth=${token}`,
        method: "PATCH",
        body: patch,
      }),
      async onQueryStarted(
        {userId, token, ...patch},
        {dispatch, queryFulfilled},
      ) {
        const patchResult = dispatch(
          userApi.util.updateQueryData(
            "getUserById",
            {userId, token},
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
    uploadUserPicture: builder.mutation({
      queryFn: async ({uri, userId}) => {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, "images/" + userId + ".jpg");
          const response = await fetch(uri);
          const blobFile = await response.blob();
          const data = await uploadBytesResumable(imageRef, blobFile);
          const url = await getDownloadURL(data.ref);

          return {
            data: url,
          }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error'
            } as FetchBaseQueryError
          }
        }
      }
    })
  }),
});

export const {
  useGetUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useLazyGetUserQuery,
  useUploadUserPictureMutation,
} = userApi;
