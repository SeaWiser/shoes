import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "@navigators/HomeStackNavigator";
import Favorites from "@screens/favorites";
import Cart from "@screens/cart";
import Notifications from "@screens/notifications";
import Profile from "@screens/profile";
import { colors } from "@constants/colors";
import HomeIcon from "@assets/images/navigation/home.svg";
import FavoriteIcon from "@assets/images/navigation/favorite.svg";
import CartIcon from "@assets/images/navigation/cart.svg";
import NotificationsIcon from "@assets/images/navigation/notifications.svg";
import ProfileIcon from "@assets/images/navigation/user.svg";
import BottomTabsBackground from "@assets/images/navigation/bottomTabsBackground.svg";
import {
  FOCUSED_ICON_SIZE,
  IS_LARGE_SCREEN,
  SCREEN_WIDTH,
  SMALL_ICON_SIZE,
} from "@constants/sizes";
import { radius } from "@constants/radius";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { filterTouchableOpacityProps } from "@utils/filterTouchableOpacityProps";
import DrawerIcon from "@assets/images/navigation/drawer.svg";
import { spaces } from "@constants/spaces";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Tabs = createBottomTabNavigator();

const originalWidth = 375;
const originalHeight = IS_LARGE_SCREEN ? 212 : 106;
const aspectRatio = originalWidth / originalHeight;

export default function BottomTabsNavigator() {
  const badgeCount = useSelector((state: RootState) => state.cart.shoes.length);
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<DrawerNavigationProp<{ MainCart: undefined }>>();

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: colors.WHITE,
      }}
    >
      <Tabs.Navigator
        screenOptions={({ navigation }) => ({
          popToTopOnBlur: true,
          tabBarStyle: {
            height: originalHeight,
            backgroundColor: colors.LIGHT,
            paddingTop: insets.bottom + 20,
            borderTopWidth: 0,
            elevation: 0,
          },
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
          headerShadowVisible: false,
          tabBarIconStyle: {
            top: "50%",
            transform: [{ translateY: -SMALL_ICON_SIZE / 2 }],
          },
          tabBarButton: (props) => (
            <TouchableOpacity
              {...filterTouchableOpacityProps(props)}
              activeOpacity={1}
            />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.BLUE,
          tabBarInactiveTintColor: colors.GREY,
          tabBarBackground: () => (
            <View style={{ aspectRatio }}>
              <BottomTabsBackground
                width={SCREEN_WIDTH}
                height={"100%"}
                viewBox={`0 0 ${originalWidth} ${originalHeight}`}
              />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => {
            const parentNavigation =
              navigation.getParent<DrawerNavigationProp<ParamListBase>>();

            return (
              <Pressable
                style={styles.drawerIconContainer}
                onPress={() => parentNavigation?.openDrawer()}
              >
                <DrawerIcon />
              </Pressable>
            );
          },
        })}
      >
        <Tabs.Screen
          name="HomeStack"
          component={HomeStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <HomeIcon
                width={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                height={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Favorites"
          component={Favorites}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <FavoriteIcon
                width={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                height={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Cart"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("MainCart");
            },
          }}
          component={Cart}
          options={({ navigation }) => ({
            tabBarBadge: badgeCount ? badgeCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: colors.LIGHT,
              color: colors.BLUE,
              marginTop: -30,
            },
            tabBarIcon: ({ color }) => (
              <Pressable
                style={[
                  styles.cartContainer,
                  badgeCount ? styles.activeCart : styles.inactiveCart,
                ]}
                onPress={() => navigation.navigate("MainCart")}
              >
                <CartIcon
                  width={badgeCount ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                  height={badgeCount ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                  color={badgeCount ? colors.WHITE : color}
                />
              </Pressable>
            ),
          })}
        />
        <Tabs.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <NotificationsIcon
                width={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                height={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <ProfileIcon
                width={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                height={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
      </Tabs.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerIconContainer: {
    marginLeft: spaces.L,
  },
  cartContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.FULL,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.select({
      ios: originalHeight - 60 + 25,
      android: originalHeight - 60 + 10,
    }),
  },
  activeCart: {
    backgroundColor: colors.BLUE,
  },
  inactiveCart: {
    backgroundColor: colors.WHITE,
  },
});
