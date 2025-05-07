import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FavoriteItem {
  id: string | null;
  shoesIds: string[];
}

interface ApiResponse {
  [key: string]: string[];
}

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  endpoints: (build) => ({
    getAllFavorites: build.query<FavoriteItem, void>({
      query: () => "favorites.json",
      transformResponse: (response: ApiResponse): FavoriteItem => {
        const favorites: FavoriteItem = {} as FavoriteItem;
        for (const key in response) {
          favorites.id = key;
          favorites.shoesIds = [...response[key]];
        }
        return favorites;
      },
    }),
    addFavorite: build.mutation({
      query: (shoesId) => ({
        url: "favorites.json",
        method: "POST",
        body: [shoesId],
      }),
      async onQueryStarted(shoesId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const patchResult = dispatch(
            favoritesApi.util.upsertQueryData("getAllFavorites", undefined, {
              id: data.name,
              shoesIds: [shoesId],
            }),
          );
        } catch {}
      },
    }),
    updateFavorites: build.mutation({
      query: ({ id, shoesIds }) => ({
        url: `favorites/${id}.json`,
        method: "PUT",
        body: shoesIds,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          favoritesApi.util.updateQueryData(
            "getAllFavorites",
            undefined,
            (draft) => {
              if (arg.shoesIds?.length === 0) {
                draft.id = null;
              }
              draft.shoesIds = arg.shoesIds;
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
  useGetAllFavoritesQuery,
  useAddFavoriteMutation,
  useUpdateFavoritesMutation,
} = favoritesApi;
