import { useState, useEffect } from "react";
import { useCurrentUser } from "@hooks/queries/useAuth";
import { useGetAllSeenNotifications } from "@hooks/queries/useNotifications";

interface AppInitializationState {
  isLoading: boolean;
  progress: number;
  currentStep: string;
  isReady: boolean;
}

export function useAppInitialization(): AppInitializationState {
  const [state, setState] = useState<AppInitializationState>({
    isLoading: true,
    progress: 0,
    currentStep: "Initialisation...",
    isReady: false,
  });

  const {
    data: currentUser,
    isLoading: isLoadingAuth,
    error: authError,
  } = useCurrentUser();
  const { data: notifications, isLoading: isLoadingNotifications } =
    useGetAllSeenNotifications();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // ✅ Étape 1: Démarrage avec délai visible
        setState((prev) => ({
          ...prev,
          progress: 10,
          currentStep: "Initialisation de l'application...",
        }));

        await new Promise((resolve) => setTimeout(resolve, 400)); // ✅ Délai visible

        // ✅ Étape 2: Stores locaux
        setState((prev) => ({
          ...prev,
          progress: 25,
          currentStep: "Chargement des préférences...",
        }));

        await new Promise((resolve) => setTimeout(resolve, 300));

        // ✅ Étape 3: Authentification
        setState((prev) => ({
          ...prev,
          progress: 50,
          currentStep: "Vérification de la session...",
        }));

        // Attendre l'auth avec un minimum de temps visible
        const authStartTime = Date.now();
        while (isLoadingAuth && !authError) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // ✅ Garantir au moins 500ms pour cette étape
        const authElapsed = Date.now() - authStartTime;
        if (authElapsed < 500) {
          await new Promise((resolve) =>
            setTimeout(resolve, 500 - authElapsed),
          );
        }

        // ✅ Étape 4: Notifications (si connecté)
        if (currentUser) {
          setState((prev) => ({
            ...prev,
            progress: 75,
            currentStep: "Synchronisation des données...",
          }));

          await new Promise((resolve) => setTimeout(resolve, 400));
        }

        // ✅ Étape 5: Finalisation
        setState((prev) => ({
          ...prev,
          progress: 90,
          currentStep: "Finalisation...",
        }));

        await new Promise((resolve) => setTimeout(resolve, 300));

        // ✅ Étape 6: Prêt
        setState((prev) => ({
          ...prev,
          progress: 100,
          currentStep: "Prêt !",
        }));

        // ✅ Laisser voir "100%" pendant un moment
        await new Promise((resolve) => setTimeout(resolve, 400));

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isReady: true,
        }));
      } catch (error) {
        console.error("❌ Erreur initialisation app:", error);

        // ✅ Mode dégradé avec feedback
        setState((prev) => ({
          ...prev,
          progress: 100,
          currentStep: "Prêt (mode hors ligne)",
          isLoading: false,
          isReady: true,
        }));
      }
    };

    initializeApp();
  }, [
    currentUser,
    isLoadingAuth,
    authError,
    isLoadingNotifications,
    notifications,
  ]);

  return state;
}
