import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@constants/colors";
import { RootStackParamList } from "@models/navigation";
import { shoes } from "@data/shoes";
import { ShoeStock } from "@models/shoe";
import { spaces } from "@constants/spaces";
import ListItemSeparator from "@ui-components/separators/ListItemSeparator";
import { IS_LARGE_SCREEN, SCREEN_HEIGHT } from "@constants/sizes";
import VerticalCard from "@ui-components/cards/VerticalCard";
import TextBoldL from "@ui-components/texts/TextBoldL";
// ✅ Migration des imports
import { useAuthStore } from "../../store/authStore";
import { useUserById } from "@hooks/queries/useUser";
import { useFavoritesStore } from "../../store/favoritesStore";
import { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

type FavoritesProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
};

export default function Favorites({ navigation }: FavoritesProps) {
  // ✅ Migration Redux → Zustand
  const { user: authUser, isAuthenticated } = useAuthStore();
  const { favoritesShoesIds, syncFavorites } = useFavoritesStore();

  const userId = authUser?.$id;

  // ✅ Migration Query Redux → Tanstack Query
  const {
    data: user,
    isLoading,
    refetch,
  } = useUserById(userId!, {
    enabled: !!userId,
  });

  // ✅ Synchroniser les favoris entre Appwrite et Zustand
  useEffect(() => {
    if (user?.favoriteIds) {
      console.log("📋 Synchronisation favoris Appwrite → Zustand");
      console.log("Favoris Appwrite:", user.favoriteIds);
      console.log("Favoris Zustand:", favoritesShoesIds);

      // Sync seulement si différents
      if (
        JSON.stringify(user.favoriteIds.sort()) !==
        JSON.stringify(favoritesShoesIds.sort())
      ) {
        syncFavorites(user.favoriteIds);
      }
    }
  }, [user?.favoriteIds, favoritesShoesIds, syncFavorites]);

  // ✅ Rafraîchissement automatique lors du focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        console.log("🔄 Rafraîchissement des favoris lors du focus...");
        refetch();
      }
    }, [userId, refetch]),
  );

  // ✅ Utiliser les favoris de Zustand pour un affichage optimiste
  const activeFavoriteIds = user?.favoriteIds || favoritesShoesIds;

  // Mapper les IDs favoris vers les objets ShoeStock
  const favoriteShoes =
    activeFavoriteIds.length > 0
      ? (activeFavoriteIds
          .map((id: string) => {
            console.log("🔍 Recherche de l'article avec ID:", id);
            const brand = shoes.find((item) =>
              item.stock.find((elem) => elem.id === id),
            );
            const shoe = brand?.stock.find((el) => el.id === id);
            if (!shoe) {
              console.warn(`⚠️ Article non trouvé pour l'ID: ${id}`);
            }
            return shoe;
          })
          .filter(Boolean) as ShoeStock[])
      : [];

  console.log("📊 Statistiques favoris:");
  console.log("- IDs favoris actifs:", activeFavoriteIds.length);
  console.log("- Articles trouvés:", favoriteShoes.length);
  console.log(
    "- Articles favoris:",
    favoriteShoes.map((s) => s.id),
  );

  const navigateToDetails = (id: string) =>
    navigation.navigate("Details", { id });

  const renderItem: ListRenderItem<ShoeStock> = ({ item }) => (
    <View style={styles.cardContainer}>
      <VerticalCard
        item={item}
        listScreen
        onPress={() => navigateToDetails(item.id)}
        isFavorite
      />
    </View>
  );

  // ✅ États de chargement et d'erreur améliorés
  if (isLoading) {
    return (
      <View style={styles.emptyListContainer}>
        <ActivityIndicator size="large" color={colors.DARK} />
        <TextBoldL style={styles.loadingText}>
          Chargement de vos favoris...
        </TextBoldL>
      </View>
    );
  }

  if (!isAuthenticated || !userId) {
    return (
      <View style={styles.emptyListContainer}>
        <TextBoldL style={styles.emptyText}>
          Connectez-vous pour voir vos favoris
        </TextBoldL>
      </View>
    );
  }

  if (activeFavoriteIds.length === 0) {
    return (
      <View style={styles.emptyListContainer}>
        <TextBoldL style={styles.emptyText}>
          Vous n'avez pas encore de favoris
        </TextBoldL>
        <TextBoldL style={styles.emptySubText}>
          Ajoutez des articles en appuyant sur ⭐
        </TextBoldL>
      </View>
    );
  }

  if (favoriteShoes.length === 0 && activeFavoriteIds.length > 0) {
    return (
      <View style={styles.emptyListContainer}>
        <TextBoldL style={styles.emptyText}>
          Articles favoris introuvables
        </TextBoldL>
        <TextBoldL style={styles.emptySubText}>
          Certains articles ont peut-être été supprimés
        </TextBoldL>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteShoes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        ItemSeparatorComponent={() => <ListItemSeparator height={spaces.L} />}
        contentContainerStyle={styles.contentStyle}
        // ✅ Améliorer la performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        // ✅ Pull to refresh
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

// ✅ Styles améliorés avec nouveaux états
const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    paddingHorizontal: spaces.L,
  },
  container: {
    height: SCREEN_HEIGHT,
    backgroundColor: colors.LIGHT,
    paddingTop: spaces.L,
    paddingBottom: 106,
  },
  contentStyle: {
    paddingBottom: spaces.XL + (IS_LARGE_SCREEN ? 212 : 106),
  },
  cardContainer: {
    flex: 0.5,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spaces.M,
    color: colors.GREY,
    textAlign: "center",
  },
  emptyText: {
    color: colors.DARK,
    textAlign: "center",
    marginBottom: spaces.S,
  },
  emptySubText: {
    color: colors.GREY,
    textAlign: "center",
    fontSize: 14,
  },
});
