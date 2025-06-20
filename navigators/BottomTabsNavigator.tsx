import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
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
import { useRef, useEffect } from "react";
import { useCartStore } from "@store/cartStore";
import { useNotificationManager } from "@hooks/useNotificationManager";
import TextBoldS from "@ui-components/texts/TextBoldS";

const Tabs = createBottomTabNavigator();

const originalWidth = 375;
const originalHeight = IS_LARGE_SCREEN ? 120 : 90;
const aspectRatio = originalWidth / originalHeight;

interface AnimatedTabIconProps {
  IconComponent: React.ComponentType<any>;
  color: string;
  focused: boolean;
  badge?: number | null | undefined;
  showPulse?: boolean;
}

const isValidBadge = (badge: number | null | undefined): badge is number => {
  return typeof badge === "number" && badge > 0;
};

const AnimatedTabIcon = ({
  IconComponent,
  color,
  focused,
  badge,
  showPulse = false,
}: AnimatedTabIconProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const shouldShowBadge = isValidBadge(badge);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [focused, scaleAnim]);

  useEffect(() => {
    if (showPulse && shouldShowBadge) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [showPulse, shouldShowBadge, pulseAnim]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [
              { scale: scaleAnim },
              ...(showPulse ? [{ scale: pulseAnim }] : []),
            ],
          },
          focused && styles.focusedIconWrapper,
        ]}
      >
        <IconComponent
          width={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
          height={focused ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
          color={color}
        />

        {shouldShowBadge && (
          <View style={styles.customBadge}>
            <TextBoldS style={styles.badgeText}>
              {badge > 99 ? "99+" : badge.toString()}
            </TextBoldS>
          </View>
        )}
      </Animated.View>

      {focused && <View style={styles.focusIndicator} />}
    </View>
  );
};

const AnimatedCartIcon = ({ color, focused, badgeCount }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const shouldShowBadge = Boolean(badgeCount && badgeCount > 0);

  useEffect(() => {
    if (shouldShowBadge) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldShowBadge, bounceAnim]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: shouldShowBadge ? 1.05 : focused ? 1.02 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [focused, shouldShowBadge, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.cartContainer,
        shouldShowBadge ? styles.activeCart : styles.inactiveCart,
        {
          transform: [{ scale: scaleAnim }, { scale: bounceAnim }],
        },
      ]}
    >
      <CartIcon
        width={shouldShowBadge ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
        height={shouldShowBadge ? FOCUSED_ICON_SIZE : SMALL_ICON_SIZE}
        color={shouldShowBadge ? colors.WHITE : color}
      />

      {shouldShowBadge && (
        <View style={styles.cartBadge}>
          <TextBoldS style={styles.cartBadgeText}>
            {badgeCount! > 99 ? "99+" : badgeCount!.toString()}
          </TextBoldS>
        </View>
      )}
    </Animated.View>
  );
};

export default function BottomTabsNavigator() {
  const { shoes: cartShoes } = useCartStore();
  const { unreadNotificationsCount } = useNotificationManager();

  const badgeCount = cartShoes.length;

  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<DrawerNavigationProp<{ MainCart: undefined }>>();
  const extraTabBarPadding =
    Platform.OS === "android" ? insets.bottom + 12 : undefined;

  return (
    <View style={styles.container}>
      <Tabs.Navigator
        screenOptions={({ navigation }) => ({
          popToTopOnBlur: true,
          tabBarStyle: [
            styles.tabBarStyle,
            {
              height: originalHeight,
              paddingTop: 12,
              ...(extraTabBarPadding !== undefined && {
                paddingBottom: extraTabBarPadding,
              }),
            },
          ],
          headerStyle: styles.headerStyle,
          headerShadowVisible: false,
          tabBarIconStyle: styles.tabBarIconStyle,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...filterTouchableOpacityProps(props)}
              activeOpacity={0.7}
              style={[props.style, styles.tabButton]}
            />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.BLUE,
          tabBarInactiveTintColor: colors.GREY,
          tabBarBackground: () => (
            <View style={[styles.backgroundContainer, { aspectRatio }]}>
              <BottomTabsBackground
                width={SCREEN_WIDTH}
                height="100%"
                viewBox={`0 0 ${originalWidth} ${originalHeight}`}
              />
              <View style={styles.tabBarOverlay} />
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
                android_ripple={{ color: colors.BLUE + "20", radius: 20 }}
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
              <AnimatedTabIcon
                IconComponent={HomeIcon}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="Favorites"
          component={Favorites}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                IconComponent={FavoriteIcon}
                color={color}
                focused={focused}
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
            tabBarIcon: ({ color, focused }) => (
              <Pressable
                onPress={() => navigation.navigate("MainCart")}
                style={styles.cartPressable}
              >
                <AnimatedCartIcon
                  color={color}
                  focused={focused}
                  badgeCount={badgeCount}
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
              <AnimatedTabIcon
                IconComponent={NotificationsIcon}
                color={color}
                focused={focused}
                badge={unreadNotificationsCount}
                showPulse={unreadNotificationsCount > 0}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                IconComponent={ProfileIcon}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  tabBarStyle: {
    backgroundColor: colors.WHITE,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: colors.DARK,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "visible",
  },
  headerStyle: {
    backgroundColor: colors.LIGHT,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarIconStyle: {
    top: "50%",
    transform: [{ translateY: -SMALL_ICON_SIZE / 2 }],
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  backgroundContainer: {
    position: "relative",
    overflow: "hidden",
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${colors.WHITE}05`,
  },
  drawerIconContainer: {
    marginLeft: spaces.L,
    padding: spaces.S,
    borderRadius: radius.REGULAR,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 4,
  },
  iconWrapper: {
    padding: 6,
    borderRadius: radius.REGULAR,
    alignItems: "center",
    justifyContent: "center",
  },
  focusedIconWrapper: {
    backgroundColor: `${colors.BLUE}10`,
  },
  focusIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.BLUE,
    marginTop: 2,
  },
  customBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.RED,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  badgeText: {
    color: colors.WHITE,
    fontSize: 9,
    lineHeight: 11,
  },
  cartPressable: {
    alignItems: "center",
    justifyContent: "center",
  },
  cartContainer: {
    width: 50,
    height: 50,
    borderRadius: radius.FULL,
    justifyContent: "center",
    alignItems: "center",
    elevation: Platform.OS === "android" ? 4 : 6,
    shadowColor: Platform.OS === "ios" ? colors.DARK : "transparent",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    position: "relative",
  },
  activeCart: {
    backgroundColor: colors.BLUE,
  },
  inactiveCart: {
    backgroundColor: colors.WHITE,
    borderWidth: 2,
    borderColor: colors.GREY,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.RED,
    borderRadius: 11,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.WHITE,
    elevation: 3,
    shadowColor: colors.DARK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  cartBadgeText: {
    color: colors.WHITE,
    fontSize: 9,
    lineHeight: 11,
  },
});
