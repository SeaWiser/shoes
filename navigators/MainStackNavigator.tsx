import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
import { colors } from "@constants/colors";
import Details from "@screens/details";
import { MainStackParamList } from "@models/navigation";
import DrawerNavigator from "@navigators/DrawerNavigator";
import Cart from "@screens/cart";
import Signup from "@screens/auth/Signup";
import Login from "@screens/auth/Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store";
import { setHttpError } from "@store/slices/errorSlice";
import HttpErrorModal from "@ui-components/modals/httpErrorModal";
import { useGetCurrentUserQuery } from "@store/api/authApi";
import { useEffect, useState } from "react";
import SplashScreen from "@screens/splashScreen";
import List from "@screens/list";
import NewsList from "@screens/newsList";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const {
    data: currentUser,
    isLoading: isCheckingAuth,
    error: authError,
  } = useGetCurrentUserQuery();

  const httpError = useSelector((state: RootState) => state.error.httpError);
  const [splashVisible, setSplashVisible] = useState(true);

  const closeHttpErrorModal = () => {
    dispatch(setHttpError(false));
  };

  useEffect(() => {
    if (currentUser) {
      console.log("✅ Utilisateur connecté:", currentUser.email);
    } else if (!isCheckingAuth) {
      console.log("ℹ️ Aucun utilisateur connecté");
    }
  }, [currentUser, isCheckingAuth]);

  // Gestion du SplashScreen
  const handleSplashScreenAnimationFinish = () => {
    console.log("SplashScreen animation terminée");
    if (!isCheckingAuth) {
      setSplashVisible(false);
    }
  };

  useEffect(() => {
    if (!isCheckingAuth && splashVisible) {
      setSplashVisible(false);
    }
  }, [isCheckingAuth, splashVisible]);

  if (isCheckingAuth || splashVisible) {
    return <SplashScreen appReadyHandler={handleSplashScreenAnimationFinish} />;
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
            <Stack.Group
              screenOptions={({ navigation }) => ({
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
            >
              <Stack.Screen name="Details" component={Details} />
              <Stack.Screen
                name="MainCart"
                component={Cart}
                options={{
                  title: "Mon Panier",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Group
                screenOptions={{
                  contentStyle: {
                    backgroundColor: colors.LIGHT,
                    paddingBottom: insets.bottom,
                  },
                }}
              >
                <Stack.Screen name="List" component={List} />
                <Stack.Screen
                  name="NewsList"
                  component={NewsList}
                  options={{
                    title: "Nouveautés",
                  }}
                />
              </Stack.Group>
            </Stack.Group>
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
