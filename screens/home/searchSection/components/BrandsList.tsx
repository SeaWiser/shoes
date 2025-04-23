import { FlatList, StyleSheet } from "react-native";
import { brands } from "../../../../data/brand";
import BrandItem from "./BrandItem";
import ItemSeparator from "../../../../ui-components/separators/ListItemSeparator";
import { spaces } from "../../../../constants/spaces";

type BrandsListProps = {
  selectedBrand: string;
  setSelectedBrand: (name: string) => void;
}

export default function BrandsList({ selectedBrand, setSelectedBrand }: BrandsListProps) {
  return (
    <FlatList horizontal
              data={brands}
              style={styles.listContainer}
              ItemSeparatorComponent={() => <ItemSeparator width={spaces.S} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.contentStyle}
              keyExtractor={(item) => item.name}
              renderItem={({ item, index }) =>
                <BrandItem item={item}
                           selectedBrand={selectedBrand}
                           setSelectedBrand={setSelectedBrand}
                           index={index}
                />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 0,
  },
  contentStyle: {
    justifyContent: "space-between",
  },
});