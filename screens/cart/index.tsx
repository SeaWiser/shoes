import { View, StyleSheet, Text } from "react-native";
import { colors } from "@constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function Cart() {
  const state = useSelector((state: RootState) => state.cart);
  const { shoes, totalAmount } = state;
  console.log(shoes, totalAmount);

  return (
    <View style={styles.container}>
      <Text>Cart</Text>
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
