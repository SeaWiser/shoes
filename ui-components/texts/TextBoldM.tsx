import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";
import { textSize } from "../../constants/textSize";
import { colors } from "../../constants/colors";

type TextBoldMProps = {
  children: React.ReactNode;
  blue?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextBoldM = ({ children, blue = false, style }: TextBoldMProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }, style]}>{children}</Text>
  );
};

export default TextBoldM;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "SemiBold",
    fontSize: textSize.M,
  },
});