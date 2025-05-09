import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, StyleSheet, Image, Text } from "react-native";
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
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGetUserByIdQuery } from "../store/api/userApi";

type LabelProps = {
  shoesInCartCount: number | undefined;
  label: string;
  activeIndex: number;
  index: number;
};

const Drawer = createDrawerNavigator();

const routes = [
  { name: "HomeStack", label: "Accueil", icon: HomeIcon, index: 0 },
  { name: "Favorites", label: "Favoris", icon: FavoriteIcon, index: 1 },
  { name: "MainCart", label: "Panier", icon: CartIcon, index: 2 },
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

const Label = ({ shoesInCartCount, label, activeIndex, index }: LabelProps) => {
  return shoesInCartCount && label === "Panier" ? (
    <View style={styles.cartView}>
      <Text style={[styles.label, { color: colors.BLUE }]}>{label}</Text>
      <View style={styles.activeCartContainer}>
        <Text style={{ color: colors.WHITE }}>{shoesInCartCount}</Text>
      </View>
    </View>
  ) : (
    <Text
      style={[
        styles.label,
        { color: activeIndex === index ? colors.WHITE : colors.GREY },
      ]}
    >
      {label}
    </Text>
  );
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const userId = useSelector((state: RootState) => state.user.id);
  const { data: user } = useGetUserByIdQuery(userId);
  const activeIndex = props.state.routes[0].state?.index || 0;
  const shoesInCartCount = user?.cart?.shoes?.length;

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
          label={() => (
            <Label
              shoesInCartCount={shoesInCartCount}
              label={route.label}
              activeIndex={activeIndex}
              index={route.index}
            />
          )}
          icon={() => (
            <route.icon
              width={SMALL_ICON_SIZE}
              height={SMALL_ICON_SIZE}
              color={
                shoesInCartCount && route.label === "Panier"
                  ? colors.BLUE
                  : activeIndex === route.index
                    ? colors.WHITE
                    : colors.GREY
              }
            />
          )}
          onPress={() => {
            if (route.name === "MainCart") {
              props.navigation.navigate(route.name);
            } else {
              props.navigation.navigate("BottomTabs", { screen: route.name });
            }
          }}
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
  cartView: {
    flexDirection: "row",
  },
  activeCartContainer: {
    marginLeft: spaces.M,
    width: SMALL_ICON_SIZE,
    height: SMALL_ICON_SIZE,
    backgroundColor: colors.BLUE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.FULL,
  },
});
