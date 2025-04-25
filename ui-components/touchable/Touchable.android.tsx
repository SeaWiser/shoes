import { StyleProp, TouchableNativeFeedback, ViewStyle } from "react-native";
import { colors } from "../../constants/colors";
import React from "react";

type TouchableProps = {
  styles: StyleProp<ViewStyle>,
  children?: React.ReactNode,
}

export default function Touchable({ styles, children }: TouchableProps) {
  return (
    <TouchableNativeFeedback style={styles}
                             background={TouchableNativeFeedback.Ripple(colors.LIGHT, true)}>
      {children}
    </TouchableNativeFeedback>
  );
}