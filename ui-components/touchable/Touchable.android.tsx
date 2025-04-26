import { StyleProp, TouchableNativeFeedback, ViewStyle } from "react-native";
import React from "react";

import { colors } from "@constants/colors";

type TouchableProps = {
  styles: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
  color: string;
};

export default function Touchable({ styles, children, onPress, color = colors.LIGHT }: TouchableProps) {
  return (
    <TouchableNativeFeedback
      style={styles}
      background={TouchableNativeFeedback.Ripple(color, true)} // utilisation de la props color
      onPress={onPress}
    >
      {children}
    </TouchableNativeFeedback>
  );
}
