if (__DEV__) {
  require("./ReactotronConfig");
}
import { debugConfiguration } from "./appwrite";
import { colors } from "@constants/colors";
import { useEffect } from "react";
import { linkingConfig } from "@utils/linking";
import "react-native-url-polyfill/auto";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainStackNavigator from "@navigators/MainStackNavigator";
import { Linking, StatusBar } from "react-native";
import QueryProvider from "./providers/QueryProvider";

export default function App() {
  useEffect(() => {
    debugConfiguration();
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log("🔗 Deep link reçu :", url);
    });
  });

  const [fontsLoaded] = useFonts({
    Light: require("./assets/fonts/Montserrat-Light.ttf"),
    Regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    Medium: require("./assets/fonts/Montserrat-Medium.ttf"),
    SemiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
  });

  return fontsLoaded ? (
    <QueryProvider>
      <SafeAreaProvider>
        <NavigationContainer linking={linkingConfig}>
          <MainStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.LIGHT} />
    </QueryProvider>
  ) : null;
}
