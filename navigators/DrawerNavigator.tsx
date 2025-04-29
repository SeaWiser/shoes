import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, StyleSheet, Image } from "react-native";
import BottomTabsNavigator from "@navigators/BottomTabsNavigator";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import { colors } from "@constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SMALL_ICON_SIZE } from "@constants/sizes";
import HomeIcon from "@assets/images/navigation/home.svg";
import ProfileIcon from "@assets/images/navigation/user.svg";
import FavoriteIcon from "@assets/images/navigation/favorite.svg";
import CartIcon from "@assets/images/navigation/cart.svg";
import NotificationsIcon from "@assets/images/navigation/notifications.svg";
import { useIsFocused } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const routes = [
  { name: "HomeStack", label: "Accueil", icon: HomeIcon, index: 0 },
  { name: "Favorites", label: "Favoris", icon: FavoriteIcon, index: 1 },
  { name: "Cart", label: "Panier", icon: CartIcon, index: 2 },
  {
    name: "Notifications",
    label: "Notifications",
    icon: NotificationsIcon,
    index: 3,
  },
  { name: "Profile", label: "Profile", icon: ProfileIcon, index: 4 },
];

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        popToTopOnBlur: true,
        drawerStyle: {
          backgroundColor: colors.DARK,
        },
        overlayColor: colors.DARK,
        headerShown: false,
      }}
    >
      <Drawer.Screen component={BottomTabsNavigator} name="BottomTabs" />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null; // rien à afficher tant que Drawer pas visible
  }

  const activeIndex = props.state.routes[0].state?.index || 0;
  console.log(activeIndex);

  return (
    <DrawerContentScrollView>
      <View style={styles.userInfosContainer}>
        <Image
          source={{ uri: "https://picsum.photos/seed/picsum/200/300" }}
          style={styles.image}
          resizeMode="cover"
        />
        <TextBoldXL style={styles.text}>John Doe</TextBoldXL>
      </View>
      {routes.map((route) => (
        <DrawerItem
          key={route.index}
          label={route.label}
          icon={() => (
            <route.icon
              width={SMALL_ICON_SIZE}
              height={SMALL_ICON_SIZE}
              color={activeIndex === route.index ? colors.WHITE : colors.GREY}
            />
          )}
          onPress={() =>
            props.navigation.navigate("BottomTabs", { screen: route.name })
          }
          labelStyle={[
            styles.label,
            { color: activeIndex === route.index ? colors.WHITE : colors.GREY },
          ]}
        />
      ))}
      <View style={styles.separator} />
      <DrawerItem
        label="Déconnexion"
        icon={() => (
          <MaterialIcons
            name="logout"
            size={SMALL_ICON_SIZE}
            color={colors.GREY}
          />
        )}
        labelStyle={[styles.label, { color: colors.GREY }]}
        onPress={() => console.log()}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  userInfosContainer: {
    marginLeft: spaces.L,
    marginVertical: spaces.XL,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: radius.FULL,
  },
  text: {
    color: colors.WHITE,
    marginTop: spaces.L,
  },
  separator: {
    borderWidth: 1,
    borderColor: colors.GREY,
    marginVertical: spaces.XL,
    width: "80%",
  },
  label: {
    fontSize: 18,
    fontFamily: "Medium",
  },
});
