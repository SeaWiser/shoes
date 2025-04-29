import { Platform, StyleSheet, TextInput, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import { colors } from "@constants/colors";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import { textSize } from "@constants/textSize";
import { ICON_SIZE, IS_SMALL_SCREEN } from "@constants/sizes";

type SearchInputProps = {
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
};

export default function SearchInput({
  placeholder,
  value,
  onChangeText,
}: SearchInputProps) {
  return (
    <View style={styles.inputContainer}>
      <EvilIcons
        name="search"
        size={ICON_SIZE}
        color={colors.GREY}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.WHITE,
    marginHorizontal: spaces.L,
    borderRadius: radius.FULL,
    height: IS_SMALL_SCREEN ? 44 : 50,
    maxWidth: 460,
  },
  searchIcon: {
    marginHorizontal: spaces.M,
    marginBottom: Platform.select({ android: spaces.XS, ios: 0 }),
  },
  input: {
    flex: 1,
    paddingVertical: spaces.S,
    paddingRight: spaces.S,
    color: colors.GREY,
    fontFamily: "Regular",
    fontSize: textSize.M,
  },
});
