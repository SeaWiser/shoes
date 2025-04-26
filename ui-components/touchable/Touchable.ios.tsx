import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { colors } from "@constants/colors";

type TouchableProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
  useForeground?: boolean;
  color?: string;
};

export default function Touchable({ style, children, onPress, useForeground, color = colors.LIGHT }: TouchableProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}
