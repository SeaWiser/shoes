import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import SearchSection from "./searchSection";
import ListSection from "./listSection";
import NewsSection from "./newsSection";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("nike");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <ScrollView contentContainerStyle={styles.scrollViewContainer} bounces={false}>
          <SearchSection inputValue={inputValue}
                         setInputValue={setInputValue}
                         selectedBrand={selectedBrand}
                         setSelectedBrand={setSelectedBrand}
          />
          <ListSection selectedBrand={selectedBrand} inputValue={inputValue} navigation={navigation} />
          <NewsSection selectedBrand={selectedBrand} />
        </ScrollView>
        {/*<View style={{ width: "100%", backgroundColor: "#000000", height: 106 }} />*/}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    justifyContent: "space-between",
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
});