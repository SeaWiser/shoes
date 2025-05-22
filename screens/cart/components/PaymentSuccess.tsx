import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ICON_SIZE } from "@constants/sizes";
import { colors } from "@constants/colors";
import TextBoldM from "@ui-components/texts/TextBoldM";
import CustomButton from "@ui-components/buttons/CustomButton";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";

interface PaymentSuccessProps {
  onPress: () => void;
}

export default function PaymentSuccess({ onPress }: PaymentSuccessProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="checkmark-done-circle-sharp"
          size={ICON_SIZE}
          color={colors.BLUE}
        />
        <TextBoldM style={styles.text}>Merci pour votre commande</TextBoldM>
        <CustomButton text="OK" onPress={onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "75%",
    minHeight: 160,
    padding: spaces.L,
    borderRadius: radius.REGULAR,
    borderWidth: 1,
    borderColor: colors.BLUE,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginVertical: spaces.XL,
  },
});
