import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
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
import { RootState } from "../../store/store";
import { useGetUserByIdQuery } from "../../store/api/userApi";

type ListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "List">;
};

export default function Favorites({ navigation }: ListProps) {
  const { userId, token } = useSelector((state: RootState) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery(
    { userId: userId!, token: token! },
    { skip: !userId || !token },
  );
  console.log({ userId, user });

  const data = user?.favoritesIds?.map((id) =>
    shoes
      .find((item) => item.stock.find((elem) => elem.id === id))
      ?.stock.find((el) => el.id === id),
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
      ></VerticalCard>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.emptyListContainer}>
        <ActivityIndicator size="large" color={colors.DARK} />
      </View>
    );
  }

  if (!user?.favoritesIds?.length) {
    return (
      <View style={styles.emptyListContainer}>
        <TextBoldL>Vous n'avez pas encore de favoris</TextBoldL>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data as ShoeStock[]}
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
