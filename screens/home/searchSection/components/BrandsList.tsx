import { FlatList, StyleSheet } from "react-native";

import { brands } from "@data/brand";
import { spaces } from "@constants/spaces";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import BrandItem from "@screens/home/searchSection/components/BrandItem";

type BrandsListProps = {
  selectedBrand: string;
  setSelectedBrand: (name: string) => void;
};

export default function BrandsList({
  selectedBrand,
  setSelectedBrand,
}: BrandsListProps) {
  return (
    <FlatList
      horizontal
      data={brands}
      style={styles.listContainer}
      bounces={false}
      ItemSeparatorComponent={() => <ItemSeparator width={spaces.M} />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentStyle}
      keyExtractor={(item) => item.name}
      renderItem={({ item, index }) => (
        <BrandItem
          item={item}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          index={index}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 0,
    marginTop: spaces.M,
  },
  contentStyle: {
    justifyContent: "space-between",
  },
});
