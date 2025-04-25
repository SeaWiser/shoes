import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";

import { textSize } from "@constants/textSize";
import { colors } from "@constants/colors";

type TextMediumMProps = {
  children: React.ReactNode;
  blue?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextMediumM = ({ children, blue = false, style }: TextMediumMProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }, style]}>{children}</Text>
  );
};

export default TextMediumM;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "Medium",
    fontSize: textSize.M,
  },
});