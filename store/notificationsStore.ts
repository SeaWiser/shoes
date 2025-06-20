import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationsState {
  seenNotificationsIds: string[];
  lastUpdated: number;
  addSeenNotification: (id: string) => void;
  removeSeenNotification: (id: string) => void;
  clearAllSeenNotifications: () => void;
  isNotificationSeen: (id: string) => boolean;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      seenNotificationsIds: [],
      lastUpdated: 0,

      addSeenNotification: (id: string) => {
        const { seenNotificationsIds } = get();
        if (!seenNotificationsIds.includes(id)) {
          console.log("📍 [STORE] Ajout notification vue:", id);
          console.log("📍 [STORE] Avant:", seenNotificationsIds);

          const newSeenIds = [...seenNotificationsIds, id];
          const newTimestamp = Date.now();

          set({
            seenNotificationsIds: newSeenIds,
            lastUpdated: newTimestamp,
          });

          console.log("📍 [STORE] Après:", newSeenIds);
          console.log(
            "📍 [STORE] Timestamp:",
            new Date(newTimestamp).toLocaleTimeString(),
          );
        } else {
          console.log("⚠️ [STORE] Notification déjà vue:", id);
        }
      },

      removeSeenNotification: (id: string) => {
        const { seenNotificationsIds } = get();
        console.log("🗑️ [STORE] Suppression notification vue:", id);
        set({
          seenNotificationsIds: seenNotificationsIds.filter(
            (seenId) => seenId !== id,
          ),
          lastUpdated: Date.now(),
        });
      },

      clearAllSeenNotifications: () => {
        console.log("🧹 [STORE] Suppression toutes notifications vues");
        set({
          seenNotificationsIds: [],
          lastUpdated: Date.now(),
        });
      },

      isNotificationSeen: (id: string) => {
        const result = get().seenNotificationsIds.includes(id);
        console.log("🔍 [STORE] Is notification seen?", { id, result });
        return result;
      },
    }),
    {
      name: "notifications-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);
