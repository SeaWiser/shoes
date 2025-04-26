import { View, StyleSheet, ListRenderItem, FlatList } from "react-native";

import { colors } from "@constants/colors";
import { shoes } from "@data/shoes";
import { ShoeStock } from "@models/shoe";
import { spaces } from "@constants/spaces";
import { SCREEN_HEIGHT } from "@constants/sizes";
import ListItemSeparator from "@ui-components/separators/ListItemSeparator";
import VerticalCard from "@ui-components/cards/VerticalCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";

type NewsListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "List">;
};

export default function NewsList({ navigation }: NewsListProps) {
  const items = shoes
    .map((brand) => brand.stock.find((item) => item.new))
    .filter((item): item is ShoeStock => item !== undefined);

  const navigateToDetails = (id: string) => navigation.navigate("Details", { id });

  const renderItem: ListRenderItem<ShoeStock> = ({ item }) => (
    <View style={styles.cardContainer}>
      <VerticalCard item={item} listScreen onPress={() => navigateToDetails(item.id)}></VerticalCard>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
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
  container: {
    height: SCREEN_HEIGHT,
    backgroundColor: colors.LIGHT,
    paddingTop: spaces.L,
    paddingBottom: 106,
  },
  contentStyle: {
    paddingBottom: spaces.XL,
  },
  cardContainer: {
    flex: 0.5,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
});
