import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotificationsStore } from "@store/notificationsStore";
import React from "react";
import {
  notificationsService,
  Notification,
  UpdateNotificationRequest,
} from "@services/notificationsService";

export function useGetAllSeenNotifications() {
  const { seenNotificationsIds, addSeenNotification } = useNotificationsStore();

  const query = useQuery({
    queryKey: ["seenNotifications"],
    queryFn: notificationsService.getAllSeenNotifications,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    throwOnError: false,
  });

  // ✅ Synchronisation avec le store local
  React.useEffect(() => {
    if (query.data?.notifsIds) {
      query.data.notifsIds.forEach((id) => {
        if (!seenNotificationsIds.includes(id)) {
          addSeenNotification(id);
        }
      });
    }
  }, [query.data, seenNotificationsIds, addSeenNotification]);

  return query;
}

export function useAddSeenNotification() {
  const queryClient = useQueryClient();
  const { addSeenNotification } = useNotificationsStore();

  return useMutation({
    mutationFn: notificationsService.addSeenNotification,
    // Optimistic update
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ["seenNotifications"] });

      const previousData = queryClient.getQueryData([
        "seenNotifications",
      ]) as Notification;

      if (previousData) {
        const optimisticData: Notification = {
          ...previousData,
          notifsIds: previousData.notifsIds.includes(notificationId)
            ? previousData.notifsIds
            : [...previousData.notifsIds, notificationId],
        };

        queryClient.setQueryData(["seenNotifications"], optimisticData);
        addSeenNotification(notificationId);
      }

      return { previousData };
    },
    onSuccess: (data, notificationId) => {
      // Update with the real server data
      queryClient.setQueryData(["seenNotifications"], (old: Notification) => ({
        id: data.name,
        notifsIds: old?.notifsIds || [notificationId],
      }));
    },
    onError: (error, notificationId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["seenNotifications"], context.previousData);
      }
    },
  });
}

export function useUpdateSeenNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsService.updateSeenNotifications,
    onMutate: async ({ notifsIds }: UpdateNotificationRequest) => {
      await queryClient.cancelQueries({ queryKey: ["seenNotifications"] });

      const previousData = queryClient.getQueryData(["seenNotifications"]);

      // Optimistic update
      queryClient.setQueryData(["seenNotifications"], (old: any) => ({
        ...old,
        notifsIds,
      }));

      return { previousData };
    },
    onSuccess: (_, variables) => {
      console.log("✅ Notifications mises à jour avec succès");
    },
    onError: (err, variables, context) => {
      console.error("❌ Erreur mise à jour notifications:", err);

      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["seenNotifications"], context.previousData);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["seenNotifications"] });
    },
  });
}

export function useMarkNotificationAsSeen() {
  const queryClient = useQueryClient();
  const { addSeenNotification } = useNotificationsStore();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("🎯 [MUTATION] Marquage notification:", notificationId);

      const currentData = (queryClient.getQueryData([
        "seenNotifications",
      ]) as Notification) || {
        id: "local",
        notifsIds: [],
      };

      return notificationsService.markAsSeenOptimistic(
        currentData,
        notificationId,
      );
    },
    // ✅ Optimistic update AVANT l'appel à l'API
    onMutate: async (notificationId: string) => {
      console.log("⚡ [OPTIMISTIC] Mise à jour immédiate:", notificationId);

      // ✅ Mettre à jour le store Zustand immédiatement
      addSeenNotification(notificationId);

      // ✅ Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ["seenNotifications"] });

      // ✅ Sauvegarder l'état précédent pour rollback
      const previousData = queryClient.getQueryData([
        "seenNotifications",
      ]) as Notification;

      // ✅ Mettre à jour le cache TanStack Query optimistiquement
      if (previousData) {
        const optimisticData: Notification = {
          ...previousData,
          notifsIds: previousData.notifsIds.includes(notificationId)
            ? previousData.notifsIds
            : [...previousData.notifsIds, notificationId],
        };

        queryClient.setQueryData(["seenNotifications"], optimisticData);
      }

      return { previousData };
    },
    onSuccess: (result, notificationId) => {
      console.log("✅ [SUCCESS] Notification marquée:", notificationId);
      queryClient.setQueryData(["seenNotifications"], result);
    },
    onError: (error, notificationId, context) => {
      console.error("❌ [ERROR] Rollback notification:", notificationId, error);

      // ✅ Rollback du cache TanStack Query
      if (context?.previousData) {
        queryClient.setQueryData(["seenNotifications"], context.previousData);
      }

      // ✅ Rollback du store Zustand (optionnel selon votre logique)
      // removeSeenNotification(notificationId);
    },
  });
}

export function useClearAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await notificationsService.clearAllSeenNotifications(id);
    },
    onSuccess: () => {
      // Clear local cache
      queryClient.setQueryData(["seenNotifications"], {
        id: "",
        notifsIds: [],
      });
    },
  });
}
