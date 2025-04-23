import { StyleSheet, View } from "react-native";
import { spaces } from "../../../constants/spaces";
import Banner from "../components/Banner";
import ShoesList from "./components/ShoesList";

type ListSectionProps = {
  selectedBrand: string;
  inputValue: string;
}

export default function ListSection({ selectedBrand, inputValue }: ListSectionProps) {
  return (
    <View style={styles.container}>
      <Banner text="Shoes populaires" />
      <ShoesList selectedBrand={selectedBrand} inputValue={inputValue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 240,
    paddingVertical: spaces.L,
  },
});