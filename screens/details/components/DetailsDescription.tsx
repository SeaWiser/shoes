import { StyleSheet, View } from "react-native";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumM from "@ui-components/texts/TextMediumM";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ICON_SIZE } from "@constants/sizes";
import { useAuthStore } from "../../../store/authStore";
import { useUserById, useToggleFavorite } from "@hooks/queries/useUser";
import { useFavoritesStore } from "../../../store/favoritesStore";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";

type DetailsDescriptionProps = {
  name: string;
  price: number;
  description: string;
  id: string;
};

export default function DetailsDescription({
  name,
  price,
  description,
  id,
}: DetailsDescriptionProps) {
  const { user: authUser } = useAuthStore();
  const { data: user } = useUserById(authUser?.$id!, {
    enabled: !!authUser?.$id,
  });

  const toggleFavoriteMutation = useToggleFavorite();
  const { favoritesShoesIds, toggleFavorite: toggleLocalFavorite } =
    useFavoritesStore();

  // ✅ État optimiste avec timestamp pour éviter les doubles animations
  const [optimisticState, setOptimisticState] = useState<{
    isFavorite: boolean;
    timestamp: number;
  } | null>(null);

  // ✅ Ref pour éviter les mises à jour concurrentes
  const isUpdatingRef = useRef(false);

  // ✅ Logique simplifiée pour déterminer l'état favori
  const isFavorite = (() => {
    // Utiliser l'état optimiste s'il est récent (moins de 2 secondes)
    if (optimisticState && Date.now() - optimisticState.timestamp < 2000) {
      return optimisticState.isFavorite;
    }

    // Sinon utiliser les données du serveur en priorité
    if (user?.favoriteIds) {
      return user.favoriteIds.includes(id);
    }

    // Fallback sur Zustand store
    return favoritesShoesIds.includes(id);
  })();

  const iconName = isFavorite ? "star" : "staro";

  const toggleFavorite = async () => {
    if (!user || !authUser?.$id || isUpdatingRef.current) {
      console.log(
        "❌ Action bloquée - Utilisateur non connecté ou mise à jour en cours",
      );
      return;
    }

    try {
      isUpdatingRef.current = true;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const newFavoriteState = !isFavorite;

      // ✅ Mise à jour optimiste avec timestamp
      setOptimisticState({
        isFavorite: newFavoriteState,
        timestamp: Date.now(),
      });

      console.log("🔄 Toggle favorite pour:", id, "→", newFavoriteState);

      // ✅ Mettre à jour TanStack Query avec optimistic updates
      await toggleFavoriteMutation.mutateAsync({
        userId: authUser.$id,
        documentId: user.$id,
        shoeId: id,
      });

      console.log("✅ Favoris mis à jour avec succès");

      // ✅ Clear l'état optimiste après succès
      setTimeout(() => {
        setOptimisticState(null);
      }, 100);
    } catch (error) {
      console.error("❌ Erreur mise à jour favoris:", error);

      // ✅ Rollback de l'état optimiste
      setOptimisticState(null);
    } finally {
      isUpdatingRef.current = false;
    }
  };

  return (
    <View style={styles.descriptionContainer}>
      <View>
        <TextMediumM blue style={styles.textSpacing}>
          MEILLEUR CHOIX
        </TextMediumM>
        <View style={styles.nameAndFavoriteContainer}>
          <TextBoldXL style={styles.textSpacing}>{name}</TextBoldXL>
          <AntDesign
            name={iconName}
            size={ICON_SIZE}
            color={colors.BLUE}
            onPress={toggleFavorite}
            suppressHighlighting={true}
          />
        </View>
      </View>
      <TextBoldL style={styles.textSpacing}>{price} €</TextBoldL>
      <TextMediumM style={styles.descriptionText}>{description}</TextMediumM>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    paddingHorizontal: spaces.L,
  },
  textSpacing: {
    marginBottom: spaces.S,
  },
  nameAndFavoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  descriptionText: {
    color: colors.GREY,
  },
});
