import { StyleSheet, View } from "react-native";

import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumM from "@ui-components/texts/TextMediumM";

type DetailsDescriptionProps = {
  name: string;
  price: number;
  description: string;
}

export default function DetailsDescription({ name, price, description }: DetailsDescriptionProps) {
  return (
    <View style={styles.descriptionContainer}>
      <View>
        <TextMediumM blue style={styles.textSpacing}>MEILLEUR CHOIX</TextMediumM>
        <TextBoldXL style={styles.textSpacing}>{name}</TextBoldXL>
      </View>
      <TextBoldL style={styles.textSpacing}>{price} €</TextBoldL>
      <TextMediumM style={styles.descriptionText}>{description}</TextMediumM>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    paddingHorizontal: spaces.L,
  },
  textSpacing: {
    marginBottom: spaces.S,
  },
  descriptionText: {
    color: colors.GREY,
  },
});