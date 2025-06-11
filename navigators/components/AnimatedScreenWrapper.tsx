import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { View, StyleSheet, Platform } from "react-native";
import React from "react";
import { useDrawerProgress } from "react-native-drawer-layout";
import { SCREEN_WIDTH } from "@constants/sizes";
import { radius } from "@constants/radius";

interface AnimatedScreenWrapperProps {
  children: React.ReactNode;
}

export default function AnimatedScreenWrapper({
  children,
}: AnimatedScreenWrapperProps) {
  const progress = useDrawerProgress();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 0.7]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -5])}deg` },
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, Platform.OS === "android" ? SCREEN_WIDTH - 40 : -20],
        ),
      },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, radius.REGULAR]),
    overflow: "hidden",
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
