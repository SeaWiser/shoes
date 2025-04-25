import { StyleSheet, View } from "react-native";
import { spaces } from "../../../constants/spaces";
import Banner from "../components/Banner";
import ShoesList from "./components/ShoesList";
import { IS_SMALL_SCREEN } from "../../../constants/sizes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";

type ListSectionProps = {
  selectedBrand: string;
  inputValue: string;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function ListSection({ selectedBrand, inputValue, navigation }: ListSectionProps) {
  const navigateToList = () => {
    navigation.navigate("List", { brand: selectedBrand });
  };
  return (
    <View style={styles.container}>
      <Banner text="Shoes populaires" navigate={navigateToList} />
      <ShoesList selectedBrand={selectedBrand} inputValue={inputValue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 240,
    minHeight: IS_SMALL_SCREEN ? 340 : 300,
    paddingVertical: spaces.L,
  },
});