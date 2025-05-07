import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FavoriteItem {
  id: string;

  [key: string]: any;
}

interface ApiResponse {
  [key: string]: Omit<FavoriteItem, "id">;
}

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  tagTypes: ["Favorites"],
  endpoints: (build) => ({
    getAllFavorites: build.query<FavoriteItem[], void>({
      providesTags: ["Favorites"],
      query: () => "favorites.json",
      transformResponse: (response: ApiResponse) => {
        const favorites: FavoriteItem[] = [];
        for (const key in response) {
          const favorite: FavoriteItem = {
            id: key,
            ...response[key],
          };
          favorites.push(favorite);
        }
        return favorites;
      },
    }),
    addFavorite: build.mutation({
      invalidatesTags: ["Favorites"],
      query: (shoesId) => ({
        url: "favorites.json",
        method: "POST",
        body: shoesId,
      }),
    }),
    removeFavorite: build.mutation({
      invalidatesTags: ["Favorites"],
      query: ({ id }) => ({
        url: `favorites/${id}.json`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;
