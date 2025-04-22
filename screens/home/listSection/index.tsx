import { StyleSheet, View } from "react-native";
import { spaces } from "../../../constants/spaces";
import Banner from "../components/Banner";
import ShoesList from "./components/ShoesList";

export default function ListSection() {
  return (
    <View style={styles.container}>
      <Banner text="Shoes populaires" />
      <ShoesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 240,
    paddingVertical: spaces.L,
  },
});