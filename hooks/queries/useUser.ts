import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFavoritesStore } from "@store/favoritesStore";
import { useAuthStore } from "@store/authStore";
import {
  userService,
  UpdateUserRequest,
  UploadImageRequest,
} from "@services/userService";

export function useCreateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUserProfile,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["user", variables.userId], data);
    },
  });
}

export function useUserById(userId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getUserById(userId),
    enabled: options?.enabled ?? !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

// ✅ Utiliser updateUserProfile au lieu de updateUser
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserRequest & { documentId: string }) => {
      console.log("✅ Hook - Données reçues:", JSON.stringify(data, null, 2));

      // ✅ Utiliser la méthode existante updateUserProfile
      return userService.updateUserProfile(data);
    },
    onSuccess: (result, variables) => {
      console.log("✅ Hook - Mise à jour réussie:", result);
      // Invalider les requêtes utilisateur
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
    onError: (error, variables) => {
      console.error("❌ Hook - Erreur mise à jour:", error);
      console.error("❌ Variables:", variables);
    },
  });
}

export function useUploadUserPicture() {
  return useMutation({
    mutationFn: async (
      data: UploadImageRequest & { previousPhotoUrl?: string },
    ) => {
      return userService.uploadUserPicture(data);
    },
    onSuccess: (result) => {
      console.log("✅ Upload image réussi:", result);
    },
    onError: (error) => {
      console.error("❌ Erreur upload image:", error);
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.toggleFavorite,
    // ✅ Optimistic update pour éviter le délai
    onMutate: async (variables) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({
        queryKey: ["user", variables.userId],
      });

      // Sauvegarder l'état précédent
      const previousUser = queryClient.getQueryData([
        "user",
        variables.userId,
      ]) as any;

      if (previousUser) {
        // Immediate optimistic update
        const currentFavorites = previousUser.favoriteIds || [];
        const newFavorites = currentFavorites.includes(variables.shoeId)
          ? currentFavorites.filter((id: string) => id !== variables.shoeId)
          : [...currentFavorites, variables.shoeId];

        queryClient.setQueryData(["user", variables.userId], {
          ...previousUser,
          favoriteIds: newFavorites,
        });

        console.log("🔄 Optimistic update:", {
          shoeId: variables.shoeId,
          oldFavorites: currentFavorites,
          newFavorites,
        });
      }

      return { previousUser };
    },
    onSuccess: (result, variables) => {
      // ✅ Mettre à jour avec les vraies données du serveur
      queryClient.setQueryData(["user", variables.userId], result);
      console.log("✅ Favoris synchronisés avec le serveur");
    },
    onError: (error, variables, context) => {
      console.error("❌ Erreur toggle favorite:", error);

      // ✅ Rollback en cas d'erreur
      if (context?.previousUser) {
        queryClient.setQueryData(
          ["user", variables.userId],
          context.previousUser,
        );
        console.log("🔄 Rollback effectué");
      }
    },
    // ✅ Toujours s'assurer que les données sont fraîches après l'opération
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userId],
      });
    },
  });
}

// Hook utilitaire pour gérer les favoris de l'utilisateur connecté
export function useFavoriteToggle() {
  const { user } = useAuthStore();
  const { data: userProfile } = useUserById(user?.$id!);
  const toggleFavoriteMutation = useToggleFavorite();
  const { favoritesShoesIds } = useFavoritesStore();

  const toggleFavorite = (shoeId: string) => {
    if (!user?.$id || !userProfile?.$id) {
      console.warn("User not authenticated or profile not loaded");
      return;
    }

    toggleFavoriteMutation.mutate({
      userId: user.$id,
      documentId: userProfile.$id,
      shoeId,
    });
  };

  return {
    favoritesShoesIds: userProfile?.favoriteIds || favoritesShoesIds,
    toggleFavorite,
    isLoading: toggleFavoriteMutation.isPending,
    isFavorite: (shoeId: string) =>
      (userProfile?.favoriteIds || favoritesShoesIds).includes(shoeId),
  };
}

// Hook pour synchroniser les favoris entre Appwrite et Zustand
export function useSyncFavorites() {
  const { user } = useAuthStore();
  const { data: userProfile } = useUserById(user?.$id!);
  const { favoritesShoesIds, setFavorites } = useFavoritesStore();

  React.useEffect(() => {
    if (userProfile?.favoriteIds) {
      // Sync from Appwrite to Zustand
      const appwriteFavorites = userProfile.favoriteIds;

      // Si les favoris Appwrite sont différents de Zustand, sync
      if (
        JSON.stringify(appwriteFavorites.sort()) !==
        JSON.stringify(favoritesShoesIds.sort())
      ) {
        setFavorites(appwriteFavorites);
      }
    }
  }, [userProfile?.favoriteIds, favoritesShoesIds, setFavorites]);

  return {
    isLoading: !userProfile,
    favorites: userProfile?.favoriteIds || [],
  };
}
