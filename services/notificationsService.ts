import { authService } from "./authService"; // Ajout pour l'authentification

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Notification {
  id: string;
  notifsIds: string[];
}

export interface AddNotificationResponse {
  name: string;
}

export interface UpdateNotificationRequest {
  id: string;
  notifsIds: string[];
}

export const notificationsService = {
  /**
   * Version locale uniquement - Pas d'appels API
   */
  async getAllSeenNotifications(): Promise<Notification> {
    console.log("🔔 [LOCAL] Récupération des notifications vues...");

    // ✅ Retourner directement des données par défaut
    return {
      id: "local",
      notifsIds: [], // Le store Zustand gère les vraies données
    };
  },

  async addSeenNotification(
    notificationId: string,
  ): Promise<AddNotificationResponse> {
    console.log("➕ [LOCAL] Notification marquée comme vue:", notificationId);

    // ✅ Simulation de succès
    return { name: `local-${Date.now()}` };
  },

  async updateSeenNotifications({
    id,
    notifsIds,
  }: UpdateNotificationRequest): Promise<void> {
    console.log("🔄 [LOCAL] Mise à jour notifications:", {
      id,
      count: notifsIds.length,
    });
    // ✅ Pas d'action réelle, le store Zustand gère tout
  },

  async clearAllSeenNotifications(id: string): Promise<void> {
    console.log("🗑️ [LOCAL] Suppression de toutes les notifications");
    // ✅ Pas d'action réelle
  },

  async markAsSeenOptimistic(
    currentNotifications: Notification,
    newNotificationId: string,
  ): Promise<Notification> {
    console.log("📝 [LOCAL] Marquage optimiste:", newNotificationId);

    // ✅ Retourner directement les données mises à jour
    return {
      ...currentNotifications,
      notifsIds: currentNotifications.notifsIds.includes(newNotificationId)
        ? currentNotifications.notifsIds
        : [...currentNotifications.notifsIds, newNotificationId],
    };
  },
};
