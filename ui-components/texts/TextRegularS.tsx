import { StyleSheet, Text } from "react-native";
import React from "react";
import { textSize } from "../../constants/textSize";
import { colors } from "../../constants/colors";

type TextRegularSProps = {
  children: React.ReactNode;
  blue?: boolean;
}

const TextRegularS = ({ children, blue = false }: TextRegularSProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }]}>{children}</Text>
  );
};

export default TextRegularS;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "Regular",
    fontSize: textSize.S,
  },
});