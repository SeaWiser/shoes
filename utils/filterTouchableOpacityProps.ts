import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export function filterTouchableOpacityProps(props: BottomTabBarButtonProps) {
  const {
    children,
    onPress,
    onLongPress,
    accessibilityState,
    accessibilityLabel,
    style,
    testID,
  } = props;

  return {
    children,
    onPress: onPress ?? undefined,
    onLongPress: onLongPress ?? undefined,
    accessibilityState,
    accessibilityLabel,
    style,
    testID,
  };
}
