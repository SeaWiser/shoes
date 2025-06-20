import { useNotificationsStore } from "@store/notificationsStore";
import { useUpdateUserProfile, useUserById } from "@hooks/queries/useUser";
import { useAuthStore } from "@store/authStore";
import { useMemo, useEffect } from "react";

/**
 * Hook unifié pour gérer les notifications
 */
export function useNotificationManager() {
  const { user: authUser } = useAuthStore();
  const { data: userProfile } = useUserById(authUser?.$id!, {
    enabled: !!authUser?.$id,
  });
  const updateUserMutation = useUpdateUserProfile();
  const { seenNotificationsIds, addSeenNotification, lastUpdated } =
    useNotificationsStore();

  // ✅ Synchroniser Appwrite → Zustand au démarrage
  useEffect(() => {
    if (userProfile?.seenNotifsIds) {
      userProfile.seenNotifsIds.forEach((id) => {
        if (!seenNotificationsIds.includes(id)) {
          console.log("🔄 [SYNC] Appwrite → Zustand:", id);
          addSeenNotification(id);
        }
      });
    }
  }, [userProfile?.seenNotifsIds, seenNotificationsIds, addSeenNotification]);

  // ✅ Fonction unifiée pour marquer comme vu
  const markAsSeen = async (notificationId: string) => {
    console.log("🎯 [UNIFIED] Marquage notification:", notificationId);

    if (!userProfile?.$id || !authUser?.$id) {
      console.log("❌ Pas d'utilisateur connecté");
      return;
    }

    // ✅ 1. Mise à jour optimiste du store Zustand
    if (!seenNotificationsIds.includes(notificationId)) {
      addSeenNotification(notificationId);
    }

    // ✅ 2. Mise à jour Appwrite
    const currentSeenIds = userProfile.seenNotifsIds || [];
    const newSeenIds = currentSeenIds.includes(notificationId)
      ? currentSeenIds
      : [...currentSeenIds, notificationId];

    try {
      await updateUserMutation.mutateAsync({
        documentId: userProfile.$id,
        userId: authUser.$id,
        seenNotifsIds: newSeenIds,
      });
      console.log("✅ [UNIFIED] Synchronisation réussie");
    } catch (error) {
      console.error("❌ [UNIFIED] Erreur synchronisation:", error);
    }
  };

  // ✅ Fonction pour vérifier si une notification est vue
  const isNotificationSeen = (notificationId: string) => {
    // Priorité au store Zustand (plus réactif)
    if (seenNotificationsIds.includes(notificationId)) {
      return true;
    }
    // Fallback sur Appwrite
    return userProfile?.seenNotifsIds?.includes(notificationId) || false;
  };

  // ✅ Calcul du badge unifié
  const unreadNotificationsCount = useMemo(() => {
    const availableNotifications: string[] = ["adi7p", "adi203p", "nik64p"];

    // ✅ Combiner les deux sources
    const allSeenIds = new Set<string>([
      ...seenNotificationsIds, // Store Zustand (priorité)
      ...(userProfile?.seenNotifsIds || []), // Appwrite (backup)
    ]);

    const unreadCount = availableNotifications.filter(
      (id) => !allSeenIds.has(id),
    ).length;

    console.log("🔔 [UNIFIED] Calcul badge:", {
      available: availableNotifications,
      seenFromZustand: seenNotificationsIds,
      seenFromAppwrite: userProfile?.seenNotifsIds || [],
      allSeen: Array.from(allSeenIds),
      unreadCount,
      timestamp: new Date(lastUpdated).toLocaleTimeString(),
    });

    return unreadCount;
  }, [seenNotificationsIds, userProfile?.seenNotifsIds, lastUpdated]);

  return {
    seenNotifications: seenNotificationsIds,
    markAsSeen,
    isNotificationSeen,
    unreadNotificationsCount,
    isLoading: updateUserMutation.isPending,
    hasError: updateUserMutation.isError,
    // ✅ Données de debug
    debug: {
      zustandSeenIds: seenNotificationsIds,
      appwriteSeenIds: userProfile?.seenNotifsIds || [],
    },
  };
}
