import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import TextBoldL from "@ui-components/texts/TextBoldL";
import { colors } from "@constants/colors";
import { radius } from "@constants/radius";

type CustomButtonProps = {
  text: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function CustomButton({
  text,
  onPress,
  isLoading,
  disabled,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.btnContainer, disabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.LIGHT} size="small" />
      ) : (
        <TextBoldL style={styles.btnText}>{text}</TextBoldL>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: colors.BLUE,
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.FULL,
  },
  btnText: {
    color: colors.WHITE,
  },
  btnDisabled: {
    backgroundColor: colors.BLUE,
    opacity: 0.4,
  },
});
