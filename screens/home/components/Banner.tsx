import { View, StyleSheet, TouchableOpacity } from "react-native";
import { spaces } from "../../../constants/spaces";
import TextBoldL from "../../../ui-components/texts/TextBoldL";
import TextMediumM from "../../../ui-components/texts/TextMediumM";

type BannerProps = {
  text: string;
}

export default function Banner({ text }: BannerProps) {
  const onPress = () => {
  };

  return (
    <View style={styles.container}>
      <TextBoldL>{text}</TextBoldL>
      <TouchableOpacity onPress={onPress}>
        <TextMediumM blue>Voir tout</TextMediumM>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spaces.L,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spaces.M,
  },
});