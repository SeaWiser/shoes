import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";

type TouchableProps = {
  style?: StyleProp<ViewStyle>,
  children?: React.ReactNode,
  onPress?: () => void,
}

export default function Touchable({ style, children, onPress }: TouchableProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}