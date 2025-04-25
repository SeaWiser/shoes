import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";

import { textSize } from "@constants/textSize";
import { colors } from "@constants/colors";

type TextBoldSProps = {
  children: React.ReactNode;
  blue?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextBoldS = ({ children, blue = false, style }: TextBoldSProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }, style]}>{children}</Text>
  );
};

export default TextBoldS;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "SemiBold",
    fontSize: textSize.S,
  },
});