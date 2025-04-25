import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";

import StackNavigator from "./navigators/StackNavigator";

if (__DEV__) require("./ReactotronConfig");

export default function App() {
  const fontLoaded = useFonts({
    Light: require("./assets/fonts/Montserrat-Light.ttf"),
    Regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    Medium: require("./assets/fonts/Montserrat-Medium.ttf"),
    SemiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
  });

  return fontLoaded ? (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  ) : null;
}