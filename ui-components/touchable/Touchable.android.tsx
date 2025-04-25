import { StyleProp, TouchableNativeFeedback, ViewStyle } from "react-native";
import React from "react";

import { colors } from "@constants/colors";

type TouchableProps = {
  styles: StyleProp<ViewStyle>,
  children?: React.ReactNode,
  onPress?: () => void,
}

export default function Touchable({ styles, children, onPress }: TouchableProps) {
  return (
    <TouchableNativeFeedback style={styles}
                             background={TouchableNativeFeedback.Ripple(colors.LIGHT, true)}
                             onPress={onPress}
    >
      {children}
    </TouchableNativeFeedback>
  );
}