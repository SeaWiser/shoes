import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { spaces } from "../../constants/spaces";
import { radius } from "../../constants/radius";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { textSize } from "../../constants/textSize";

type SearchInputProps = {
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
}

export default function SearchInput({ placeholder, value, onChangeText }: SearchInputProps) {
  return (
    <View style={styles.inputContainer}>
      <EvilIcons name="search" size={32} color={colors.GREY} style={styles.searchIcon} />
      <TextInput placeholder={placeholder} value={value} onChangeText={onChangeText} style={styles.input}></TextInput>
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
    height: 50,
  },
  searchIcon: {
    marginHorizontal: spaces.M,
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