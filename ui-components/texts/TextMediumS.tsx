import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";

import { textSize } from "@constants/textSize";
import { colors } from "@constants/colors";

type TextMediumSProps = {
  children: React.ReactNode;
  blue?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextMediumS = ({ children, blue = false, style }: TextMediumSProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }, style]}>{children}</Text>
  );
};

export default TextMediumS;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "Medium",
    fontSize: textSize.S,
  },
});