import { FlatList, StyleSheet } from "react-native";
import { brands } from "../../../../data/brand";
import BrandItem from "./BrandItem";
import { useState } from "react";
import ItemHorizontalSeparator from "./ItemHorizontalSeparator";

export default function BrandsList() {
  const [selectedBrand, setSelectedBrand] = useState("nike");

  return (
    <FlatList horizontal
              data={brands}
              style={styles.listContainer}
              ItemSeparatorComponent={ItemHorizontalSeparator}
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