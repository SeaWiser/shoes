import { View, StyleSheet, TextInput, TextInputProps } from "react-native";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumM from "@ui-components/texts/TextMediumM";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import { colors } from "@constants/colors";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { SMALL_ICON_SIZE } from "@constants/sizes";

type InputProps = {
  label: string;
  error: boolean | undefined;
  errorText: string | undefined;
  type?: "password";
} & Omit<TextInputProps, "secureTextEntry">;

export default function Input({
  label,
  error,
  errorText,
  type,
  ...inputProps
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputContainerStyle = error
    ? StyleSheet.compose(styles.inputContainer, styles.inputError)
    : styles.inputContainer;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TextBoldL style={styles.label}>{label}</TextBoldL>
      <View style={inputContainerStyle}>
        <TextInput
          style={styles.input}
          {...inputProps}
          secureTextEntry={type === "password" && !isPasswordVisible}
        />
        {type === "password" ? (
          <Feather
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={SMALL_ICON_SIZE}
            color={colors.DARK}
            onPress={togglePasswordVisibility}
          />
        ) : null}
      </View>
      <View style={styles.errorContainer}>
        {error && errorText ? (
          <TextMediumM style={styles.error}> {errorText}</TextMediumM>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spaces.L,
  },
  label: {
    marginBottom: spaces.XS,
  },
  inputContainer: {
    width: "100%",
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.REGULAR,
    backgroundColor: colors.WHITE,
    paddingHorizontal: spaces.M,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.RED,
    borderWidth: 1,
  },
  errorContainer: {
    minHeight: spaces.L,
    justifyContent: "center",
  },
  error: {
    color: colors.RED,
  },
});
