import { StyleSheet, Text } from "react-native";
import React from "react";
import { textSize } from "../../constants/textSize";
import { colors } from "../../constants/colors";

type TextBoldMProps = {
  children: React.ReactNode;
  blue?: boolean;
}

const TextBoldM = ({ children, blue = false }: TextBoldMProps) => {
  return (
    <Text style={[styles.txt, { color: blue ? colors.BLUE : colors.DARK }]}>{children}</Text>
  );
};

export default TextBoldM;

const styles = StyleSheet.create({
  txt: {
    fontFamily: "SemiBold",
    fontSize: textSize.M,
  },
});