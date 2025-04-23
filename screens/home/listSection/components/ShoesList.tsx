import { FlatList, StyleSheet } from "react-native";
import { shoes } from "../../../../data/shoes";
import VerticalCard from "./VerticalCard";
import ItemSeparator from "../../../../ui-components/separators/ListItemSeparator";
import { spaces } from "../../../../constants/spaces";

type ShoesListProps = {
  selectedBrand: string;
  inputValue: string;
}

export default function ShoesList({ selectedBrand, inputValue }: ShoesListProps) {
  const data =
    shoes.find(elem => elem.brand === selectedBrand)
      ?.stock.filter((item) => !item.new);

  const filteredData = inputValue
    ? data?.filter((elem) => elem.name.toLowerCase().includes(inputValue.toLowerCase()))
    : data;

  return (
    <FlatList
      data={filteredData}
      renderItem={({ item }) => <VerticalCard item={item} />}
      horizontal
      ItemSeparatorComponent={() => <ItemSeparator width={spaces.L} />}
      contentContainerStyle={styles.listContainer}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: spaces.L,
  },
});