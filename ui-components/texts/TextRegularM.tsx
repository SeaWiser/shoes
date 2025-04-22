import { StyleSheet, Text } from "react-native";
import React from "react";
import { textSize } from "../../constants/textSize";
import { colors } from "../../constants/colors";

type TextRegularMProps = {
  children: React.ReactNode;
  blue?: boolean;
}

const TextRegularM = ({ children, blue = false }: TextRegularMProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }]}>{children}</Text>
  );
};

export default TextRegularM;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "Regular",
    fontSize: textSize.M,
  },
});