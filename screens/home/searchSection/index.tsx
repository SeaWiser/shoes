import { StyleSheet, View } from "react-native";
import SearchInput from "../../../ui-components/inputs/SearchInput";
import BrandsList from "./components/BrandsList";

type SearchSectionProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
}

export default function SearchSection({
                                        inputValue,
                                        setInputValue,
                                        selectedBrand,
                                        setSelectedBrand,
                                      }: SearchSectionProps) {

  return (
    <View style={styles.container}>
      <SearchInput placeholder="Trouvez vos shoes" value={inputValue} onChangeText={setInputValue} />
      <BrandsList selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 120,
    minHeight: 120,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});