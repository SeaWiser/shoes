import { StyleSheet, View } from "react-native";
import SearchInput from "../../../ui-components/inputs/SearchInput";
import { useState } from "react";
import BrandsList from "./components/BrandsList";

export default function SearchSection() {
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.container}>
      <SearchInput placeholder="Trouvez vos shoes" value={inputValue} onChangeText={setInputValue} />
      <BrandsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flex: 120,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
});