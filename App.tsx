import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import BottomTabsNavigator from "@navigators/BottomTabsNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

if (__DEV__) require("./ReactotronConfig");

export default function App() {
  const fontLoaded = useFonts({
    Light: require("./assets/fonts/Montserrat-Light.ttf"),
    Regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    Medium: require("./assets/fonts/Montserrat-Medium.ttf"),
    SemiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
  });

  return fontLoaded ? (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabsNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  ) : null;
}
