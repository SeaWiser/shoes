import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";
import { textSize } from "../../constants/textSize";
import { colors } from "../../constants/colors";

type TextBoldLProps = {
  children: React.ReactNode;
  blue?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextBoldL = ({ children, blue = false, style }: TextBoldLProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }, style]}>{children}</Text>
  );
};

export default TextBoldL;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "SemiBold",
    fontSize: textSize.L,
  },
});