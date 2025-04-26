import { StyleProp, TouchableNativeFeedback, View, ViewStyle } from "react-native";
import React from "react";

import { colors } from "@constants/colors";

type TouchableProps = {
  styles: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
  useForeground?: boolean;
  color: string;
};

export default function Touchable({
  styles,
  children,
  onPress,
  useForeground = false,
  color = colors.LIGHT,
}: TouchableProps) {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple(color, true)}
      onPress={onPress}
      useForeground={useForeground}
    >
      {useForeground ? <View style={[styles, { overflow: "hidden" }]}>{children}</View> : children}
    </TouchableNativeFeedback>
  );
}
