import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import TextBoldS from "./ui-components/texts/TextBoldS";
import TextBoldXL from "./ui-components/texts/TextBoldXL";
import TextMediumM from "./ui-components/texts/TextMediumM";
import TextRegularS from "./ui-components/texts/TextRegularS";

export default function App() {
  const fontLoaded = useFonts({
    Light: require("./assets/fonts/Montserrat-Light.ttf"),
    Regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    Medium: require("./assets/fonts/Montserrat-Medium.ttf"),
    SemiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
  });

  return fontLoaded ? (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextBoldS blue>Open up App.tsx to start working on your app!</TextBoldS>
        <TextBoldXL>Open up App.tsx to start working on your app!</TextBoldXL>
        <TextMediumM blue>Open up App.tsx to start working on your app!</TextMediumM>
        <TextRegularS>Open up App.tsx to start working on your app!</TextRegularS>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
