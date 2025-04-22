import { StyleSheet, View } from "react-native";

export default function ListSection() {
  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flex: 240,
  },
});