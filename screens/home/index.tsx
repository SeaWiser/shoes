import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import SearchSection from "./searchSection";
import ListSection from "./listSection";
import NewsSection from "./newsSection";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={{ width: "100%", backgroundColor: "#000000", height: 60 }} />

      <SearchSection />
      <ListSection />
      <NewsSection />

      <View style={{ width: "100%", backgroundColor: "#000000", height: 106 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    justifyContent: "space-between",
  },
});