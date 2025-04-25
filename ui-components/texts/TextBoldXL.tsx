import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";

import { textSize } from "@constants/textSize";
import { colors } from "@constants/colors";

type TextBoldXLProps = {
  children: React.ReactNode;
  blue?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextBoldXL = ({ children, blue = false, style }: TextBoldXLProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }, style]}>{children}</Text>
  );
};

export default TextBoldXL;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "SemiBold",
    fontSize: textSize.XL,
  },
});