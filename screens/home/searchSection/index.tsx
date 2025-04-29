import { StyleSheet, View } from "react-native";

import SearchInput from "@ui-components/inputs/SearchInput";
import BrandsList from "@screens/home/searchSection/components/BrandsList";
import { IS_LARGE_SCREEN } from "@constants/sizes";

type SearchSectionProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
};

export default function SearchSection({
  inputValue,
  setInputValue,
  selectedBrand,
  setSelectedBrand,
}: SearchSectionProps) {
  return (
    <View style={styles.container}>
      <SearchInput
        placeholder="Trouvez vos shoes"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <BrandsList
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 120,
    minHeight: 120,
    justifyContent: "space-evenly",
    alignItems: IS_LARGE_SCREEN ? "center" : "flex-start",
  },
});
