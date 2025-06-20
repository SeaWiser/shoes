import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { colors } from "@constants/colors";
import Details from "@screens/details";
import { MainStackParamList } from "@models/navigation";
import DrawerNavigator from "@navigators/DrawerNavigator";
import Cart from "@screens/cart";
import Signup from "@screens/auth/Signup";
import Login from "@screens/auth/Login";
import { useCurrentUser } from "@hooks/queries/useAuth";
import { useErrorStore } from "@store/errorStore";
import HttpErrorModal from "@ui-components/modals/httpErrorModal";
import SplashScreen from "@screens/splashScreen";
import { useAppInitialization } from "@hooks/useAppInitialization";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  const { data: currentUser, isLoading: isCheckingAuth } = useCurrentUser();
  const { httpError, setHttpError } = useErrorStore();

  // ✅ Hook d'initialisation avec données réelles
  const { isLoading, progress, currentStep, isReady } = useAppInitialization();

  const closeHttpErrorModal = () => {
    setHttpError(false);
  };

  const appReadyHandler = () => {
    console.log("🚀 App prête à être utilisée !");
  };

  // ✅ Afficher le splash screen pendant l'initialisation
  if (isLoading || !isReady) {
    return (
      <SplashScreen
        appReadyHandler={appReadyHandler}
        progress={progress}
        currentStep={currentStep}
        isDataReady={isReady}
      />
    );
  }

  // ✅ Loader minimal pour les vérifications finales
  if (isCheckingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.BLUE} size="large" />
      </View>
    );
  }

  const isAuthenticated = !!currentUser;

  return (
    <>
      <Stack.Navigator
        screenOptions={() => ({
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
          headerShadowVisible: false,
          headerTitleAlign: "center",
        })}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: "Connexion" }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{
                title: "Formulaire d'inscription",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Drawer"
              component={DrawerNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Details"
              component={Details}
              options={({ navigation }) => ({
                headerLeft: () => (
                  <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={colors.DARK}
                    />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="MainCart"
              component={Cart}
              options={({ navigation }) => ({
                title: "Panier",
                animation: "slide_from_bottom",
                headerLeft: () => (
                  <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={colors.DARK}
                    />
                  </Pressable>
                ),
              })}
            />
          </>
        )}
      </Stack.Navigator>
      <HttpErrorModal
        isModalVisible={httpError}
        closeModal={closeHttpErrorModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
  },
});
