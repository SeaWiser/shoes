import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import { radius } from "@constants/radius";
import TextBoldL from "@ui-components/texts/TextBoldL";
import Touchable from "@ui-components/touchable/Touchable";

type GalleryProps = {
  images: ImageSourcePropType[];
  setSelectedImage: (image: ImageSourcePropType) => void;
  selectedImage: ImageSourcePropType;
};

export default function Gallery({ images, setSelectedImage, selectedImage }: GalleryProps) {
  return (
    <View style={styles.galleryContainer}>
      <TextBoldL>Galerie</TextBoldL>
      <View style={styles.imagesContainer}>
        {images.map((image, i) => (
          <View style={styles.imageContainer} key={i}>
            <View style={{ borderRadius: radius.REGULAR, overflow: "hidden" }}>
              <Touchable onPress={() => setSelectedImage(image)} color={colors.BLUE} useForeground={true}>
                <View style={[styles.imageContainer, image === selectedImage ? styles.selectedImage : undefined]}>
                  <Image source={image} style={styles.image} />
                </View>
              </Touchable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryContainer: {
    paddingHorizontal: spaces.L,
    marginTop: spaces.L,
  },
  imagesContainer: {
    flexDirection: "row",
    marginTop: spaces.M,
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: colors.LIGHT,
    borderRadius: radius.REGULAR,
    marginRight: spaces.M,
  },
  selectedImage: {
    borderWidth: 1,
    borderColor: colors.BLUE,
  },
  image: {
    width: 90,
    height: 90,
    transform: [{ rotate: "-20deg" }, { translateX: -spaces.S }, { translateY: -spaces.S }],
  },
});
