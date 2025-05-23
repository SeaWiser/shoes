import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Notification {
  id: string;
  notifsIds: string[];
}

interface ApiResponse {
  [key: string]: string[];
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  endpoints: (build) => ({
    getAllSeenNotifications: build.query<Notification, void>({
      query: () => "notifications.json",
      transformResponse: (response: ApiResponse): Notification => {
        const notifs: Notification = {} as Notification;
        for (const key in response) {
          notifs.id = key;
          notifs.notifsIds = [...response[key]];
        }
        return notifs;
      },
    }),
    addSeenNotifications: build.mutation({
      query: (notificationId) => ({
        url: "notifications.json",
        method: "POST",
        body: [notificationId],
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            notificationsApi.util.upsertQueryData(
              "getAllSeenNotifications",
              undefined,
              { id: data.name, notifsIds: [notificationId] },
            ),
          );
        } catch {}
      },
    }),
    updateSeenNotifications: build.mutation({
      query: ({ id, notifsIds }) => ({
        url: `notifications/${id}.json`,
        method: "PUT",
        body: notifsIds,
      }),
      async onQueryStarted({ notifsIds }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData(
            "getAllSeenNotifications",
            undefined,
            (draft) => {
              draft.notifsIds = notifsIds;
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
  useGetAllSeenNotificationsQuery,
  useAddSeenNotificationsMutation,
  useUpdateSeenNotificationsMutation,
} = notificationsApi;
