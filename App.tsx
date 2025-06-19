import { account, debugConfiguration, testConnection } from "./appwrite";

if (__DEV__) {
  require("./ReactotronConfig");
}
import { colors } from "@constants/colors";
import { useEffect } from "react";
import { linkingConfig } from "@utils/linking";
import "react-native-url-polyfill/auto";
import { store } from "@store/store";
import { Provider } from "react-redux";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainStackNavigator from "@navigators/MainStackNavigator";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { Linking, StatusBar } from "react-native";

export default function App() {
  const apps = getApps();
  if (apps.length === 0) {
    initializeApp(firebaseConfig);
  }

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
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer linking={linkingConfig}>
          <MainStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.LIGHT} />
    </Provider>
  ) : null;
}
