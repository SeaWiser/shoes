import { View, StyleSheet, Text } from "react-native";
import { colors } from "@constants/colors";

export default function Favorites() {
  return (
    <View style={styles.container}>
      <Text>Favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.LIGHT,
    alignItems: "center",
  },
});
