import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform, Pressable, StyleSheet } from "react-native";
import HomeScreen from "@screens/home";
import List from "@screens/list";
import NewsList from "@screens/newsList";
import { colors } from "@constants/colors";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/native";
import DrawerIcon from "@assets/images/navigation/drawer.svg";
import { spaces } from "@constants/spaces";

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: colors.LIGHT,
        },
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.DARK} />
          </Pressable>
        ),
      })}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Shoes",
          headerLeft: () => {
            const parentNavigation = navigation
              .getParent<DrawerNavigationProp<ParamListBase>>()
              .getParent<DrawerNavigationProp<ParamListBase>>();

            return (
              <Pressable
                onPress={() => parentNavigation?.openDrawer()}
                style={styles.drawerIconContainer}
              >
                <DrawerIcon />
              </Pressable>
            );
          },
        })}
      />
      <Stack.Group
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.DARK}
              ></Ionicons>
            </Pressable>
          ),
        })}
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
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerIconContainer: {
    marginLeft: Platform.select({ ios: spaces.XS, android: spaces.S }),
  },
});
