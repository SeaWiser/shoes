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
import { RootState } from "../store/store";
import { setHttpError } from "../store/slices/errorSlice";
import HttpErrorModal from "@ui-components/modals/httpErrorModal";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  const httpError = useSelector((state: RootState) => state.error.httpError);
  const dispatch = useDispatch();

  const closeHttpErrorModal = () => {
    dispatch(setHttpError(false));
  };

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
