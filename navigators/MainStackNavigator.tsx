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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setHttpError } from "../store/slices/errorSlice";
import HttpErrorModal from "@ui-components/modals/httpErrorModal";
import { useRefreshTokenMutation } from "../store/api/authApi";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { setToken, setUserId } from "../store/slices/authSlice";
import SplashScreen from "@screens/splashScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  const [refreshTokenMutation, { data }] = useRefreshTokenMutation();
  const token = useSelector((state: RootState) => state.auth.token);
  const [isLoading, setIsLoading] = useState(!token);
  const [isAppReady, setIsAppReady] = useState(false);
  const httpError = useSelector((state: RootState) => state.error.httpError);
  const dispatch = useDispatch();

  const closeHttpErrorModal = () => {
    dispatch(setHttpError(false));
  };

  const getAuthenticatedUser = async () => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (refreshToken) {
      refreshTokenMutation(refreshToken);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      getAuthenticatedUser();
    }
  }, [token]);

  useEffect(() => {
    if (data) {
      dispatch(setToken(data.id_token));
      dispatch(setUserId(data.user_id));
      SecureStore.setItemAsync("refreshToken", data.refresh_token);
      setIsLoading(false);
    }
  }, [data]);

  const appReadyHandler = () => {
    setIsAppReady(true);
  };

  if (!isAppReady) {
    return <SplashScreen appReadyHandler={appReadyHandler} />;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.BLUE} size="large" />
      </View>
    );
  }

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
        {!token ? (
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
