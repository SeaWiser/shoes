import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";

type TouchableProps = {
  style?: StyleProp<ViewStyle>,
  children?: React.ReactNode,
}

export default function Touchable({ style, children }: TouchableProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={style}>
      {children}
    </TouchableOpacity>
  );
}