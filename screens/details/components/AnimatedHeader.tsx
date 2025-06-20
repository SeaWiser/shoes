import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import CartIcon from "@assets/images/navigation/cart.svg";
import { ICON_SIZE, SCREEN_WIDTH, SMALL_ICON_SIZE } from "@constants/sizes";
import { colors } from "@constants/colors";
import TextBoldM from "@ui-components/texts/TextBoldM";
import { radius } from "@constants/radius";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withRepeat,
  runOnJS,
} from "react-native-reanimated";
import { spaces } from "@constants/spaces";

const MAIN_WIDTH = 80;

interface AnimatedHeaderProps {
  shouldAnimate: boolean;
  setShouldAnimate: (value: boolean) => void;
  cartCount: number;
}

export default function AnimatedHeader({
  shouldAnimate,
  setShouldAnimate,
  cartCount,
}: AnimatedHeaderProps) {
  const navigation = useNavigation();
  const [count, setCount] = useState(cartCount);
  const animatedTranslate = useSharedValue(SCREEN_WIDTH);
  const animatedScale = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedTranslate.value + 4 }],
  }));

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -SMALL_ICON_SIZE / 2 },
      { translateX: -SMALL_ICON_SIZE / 2 },
      { scale: animatedScale.value },
    ],
  }));

  useEffect(() => {
    if (shouldAnimate) {
      animatedTranslate.value = withTiming(spaces.M, { duration: 2000 }, () => {
        runOnJS(setCount)(cartCount);
        animatedScale.value = withRepeat(withSpring(1.5), 2, true, () => {
          animatedTranslate.value = withTiming(
            spaces.M + MAIN_WIDTH + 20,
            {
              duration: 2000,
            },
            () => {
              runOnJS(setShouldAnimate)(false);
            },
          );
        });
      });
    }
  }, [shouldAnimate]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
          <CartIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.WHITE} />
          <Animated.View style={[styles.badge, animatedBadgeStyle]}>
            <TextBoldM blue>{count}</TextBoldM>
          </Animated.View>
        </Animated.View>
      ),
    });
  }, [count]);

  return null;
}

const styles = StyleSheet.create({
  container: {
    width: MAIN_WIDTH,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: radius.REGULAR,
    borderBottomLeftRadius: radius.REGULAR,
    backgroundColor: colors.BLUE,
    overflow: "hidden",
  },
  badge: {
    width: SMALL_ICON_SIZE,
    height: SMALL_ICON_SIZE,
    position: "absolute",
    top: "50%",
    transform: [
      { translateY: -SMALL_ICON_SIZE / 2 },
      { translateX: -SMALL_ICON_SIZE / 2 },
    ],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.FULL,
    backgroundColor: colors.WHITE,
  },
});
