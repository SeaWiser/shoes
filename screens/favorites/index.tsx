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
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { useGetUserByIdQuery } from "@store/api/userApi";
import { useAuth } from "@store/api/authApi";
import { useEffect } from "react";

type FavoritesProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
};

export default function Favorites({ navigation }: FavoritesProps) {
  // Utilisation du hook useAuth pour une authentification plus fiable
  const { user: authUser, isAuthenticated } = useAuth();

  // Récupération du userId depuis le store Redux comme fallback
  const { userId: reduxUserId } = useSelector((state: RootState) => state.auth);

  // Utiliser l'ID de l'utilisateur authentifié en priorité, sinon utiliser celui du Redux
  const userId = authUser?.$id || reduxUserId;

  const {
    data: user,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  // Forcer le rafraîchissement des données lorsque l'écran est affiché
  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (userId) {
        console.log("Rafraîchissement des favoris...");
        refetch();
      }
    });
  }, [navigation, userId, refetch]);

  // Mapper les IDs favoris vers les objets ShoeStock avec vérification supplémentaire
  const favoriteShoes =
    user?.favoriteIds && user.favoriteIds.length > 0
      ? (user.favoriteIds
          .map((id: string) => {
            console.log("Recherche de l'article avec ID:", id);
            const brand = shoes.find((item) =>
              item.stock.find((elem) => elem.id === id),
            );
            return brand?.stock.find((el) => el.id === id);
          })
          .filter(Boolean) as ShoeStock[])
      : [];

  console.log("Nombre de favoris trouvés:", favoriteShoes?.length || 0);

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

  if (isLoading) {
    return (
      <View style={styles.emptyListContainer}>
        <ActivityIndicator size="large" color={colors.DARK} />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.emptyListContainer}>
        <TextBoldL>Connectez-vous pour voir vos favoris</TextBoldL>
      </View>
    );
  }

  if (!user?.favoriteIds?.length) {
    return (
      <View style={styles.emptyListContainer}>
        <TextBoldL>Vous n'avez pas encore de favoris</TextBoldL>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
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
});
