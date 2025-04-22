import { StyleSheet, Text } from "react-native";
import React from "react";
import { textSize } from "../../constants/textSize";
import { colors } from "../../constants/colors";

type TextBoldXLProps = {
  children: React.ReactNode;
  blue?: boolean;
}

const TextBoldXL = ({ children, blue = false }: TextBoldXLProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }]}>{children}</Text>
  );
};

export default TextBoldXL;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "SemiBold",
    fontSize: textSize.XL,
  },
});