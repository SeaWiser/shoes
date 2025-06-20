import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SCREEN_WIDTH } from "@constants/sizes";
import { spaces } from "@constants/spaces";

type DetailsImageProps = {
  source: ImageSourcePropType;
};

export default function DetailsImage({ source }: DetailsImageProps) {
  return (
    <View style={styles.imagesContainer}>
      <Image source={source} style={styles.image} />
      <Image
        source={require("@assets/images/details/shoes-stand.png")}
        style={styles.imageStand}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imagesContainer: {
    position: "relative",
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.7,
    alignItems: "center",
    marginBottom: spaces.M,
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.7,
    resizeMode: "contain",
    transform: [
      { rotate: "-20deg" },
      { translateX: -spaces.S },
      { translateY: -spaces.XS },
    ],
  },
  imageStand: {
    position: "absolute",
    bottom: Platform.select({
      android: spaces.M,
      ios: spaces.L,
    }),
    resizeMode: "contain",
  },
});
