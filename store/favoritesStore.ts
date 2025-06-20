import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  favoritesShoesIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  syncFavorites: (ids: string[]) => void;
  setFavorites: (ids: string[]) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritesShoesIds: [],
      addFavorite: (id) =>
        set((state) => ({
          favoritesShoesIds: state.favoritesShoesIds.includes(id)
            ? state.favoritesShoesIds
            : [...state.favoritesShoesIds, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favoritesShoesIds: state.favoritesShoesIds.filter(
            (favId) => favId !== id,
          ),
        })),
      toggleFavorite: (id) => {
        const { favoritesShoesIds } = get();
        if (favoritesShoesIds.includes(id)) {
          get().removeFavorite(id);
        } else {
          get().addFavorite(id);
        }
      },
      syncFavorites: (ids) => set({ favoritesShoesIds: ids }),
      setFavorites: (ids) => set({ favoritesShoesIds: ids }), // ✅ Ajouter la méthode setFavorites
      clearFavorites: () => set({ favoritesShoesIds: [] }),
      isFavorite: (id) => get().favoritesShoesIds.includes(id),
    }),
    {
      name: "favorites-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
