import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
import HomeScreen from "@screens/home";
import List from "@screens/list";
import NewsList from "@screens/newsList";
import { colors } from "@constants/colors";

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
        options={{
          title: "Shoes",
          headerLeft: undefined,
        }}
      />
      <Stack.Screen name="List" component={List} />
      <Stack.Screen
        name="NewsList"
        component={NewsList}
        options={{
          title: "Nouveautés",
        }}
      />
    </Stack.Navigator>
  );
}
