import { View, StyleSheet, ListRenderItem, FlatList } from "react-native";
import { colors } from "../../constants/colors";
import { shoes } from "../../data/shoes";
import { ShoeStock } from "../../types/shoe";
import VerticalCard from "../../ui-components/cards/VerticalCard";
import ListItemSeparator from "../../ui-components/separators/ListItemSeparator";
import { spaces } from "../../constants/spaces";
import { SCREEN_HEIGHT } from "../../constants/sizes";

export default function NewsList() {
  // const item =
  //   shoes.find(elem => elem.brand === selectedBrand)
  //     ?.stock.find((elem) => elem.new);
  const items = shoes
    .map(brand => brand.stock.find(item => item.new))
    .filter((item): item is ShoeStock => item !== undefined);

  const renderItem: ListRenderItem<ShoeStock> = ({ item }) => (
    <View style={styles.cardContainer}>
      <VerticalCard item={item} listScreen></VerticalCard>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList data={items}
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