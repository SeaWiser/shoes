import { Image, ImageStyle, StyleSheet, useWindowDimensions, View } from "react-native";
import Touchable from "@ui-components/touchable/Touchable";

import { ShoeStock } from "@models/shoe";
import { spaces } from "@constants/spaces";
import TextMediumM from "@ui-components/texts/TextMediumM";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import TextBoldM from "@ui-components/texts/TextBoldM";
import { IS_LARGE_SCREEN } from "@constants/sizes";
import { colors } from "@constants/colors";
import { radius } from "@constants/radius";

type HorizontalCardProps = {
  item: ShoeStock;
  onPress: () => void;
};

export default function HorizontalCard({ item, onPress }: HorizontalCardProps) {
  const { height } = useWindowDimensions();
  const landscapeStyle: ImageStyle = {
    width: "95%",
    height: "100%",
    transform: [{ rotate: "-20deg" }, { translateX: -spaces.M }, { translateY: -spaces.L }, { scale: 0.8 }],
  };

  return (
    <View style={styles.container}>
      <Touchable style={styles.touchableContainer} onPress={onPress}>
        <View style={styles.touchableContainer}>
          <View style={styles.descriptionContainer}>
            <View>
              <TextMediumM blue>MEILLEUR CHOIX</TextMediumM>
              <TextBoldXL>{item.name}</TextBoldXL>
            </View>
            <TextBoldM>{item.price} €</TextBoldM>
          </View>
          <View style={styles.imageContainer}>
            <Image source={item.items[0].image} style={height < 400 ? landscapeStyle : styles.image}></Image>
          </View>
        </View>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
    backgroundColor: colors.WHITE,
    borderRadius: radius.REGULAR,
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: spaces.L,
    elevation: 4,
    shadowColor: colors.DARK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  touchableContainer: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
  },
  descriptionContainer: {
    flex: 1,
    height: "90%",
    justifyContent: "space-between",
    padding: IS_LARGE_SCREEN ? spaces.XL * 1.5 : spaces.L,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spaces.M,
  },
  image: {
    width: "100%",
    height: "100%",
    transform: [
      { rotate: "-20deg" },
      { translateX: -spaces.M },
      { translateY: IS_LARGE_SCREEN ? -spaces.XL : -spaces.L },
      { scale: IS_LARGE_SCREEN ? 1.1 : 1.3 },
    ],
  },
});
