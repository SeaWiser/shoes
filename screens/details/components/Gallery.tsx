import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';

import { spaces } from '@constants/spaces';
import { colors } from '@constants/colors';
import { radius } from '@constants/radius';
import TextBoldL from '@ui-components/texts/TextBoldL';

type GalleryProps = {
  images: ImageSourcePropType[];
};

export default function Gallery({ images }: GalleryProps) {
  return (
    <View style={styles.galleryContainer}>
      <TextBoldL>Galerie</TextBoldL>
      <View style={styles.imagesContainer}>
        {images.map((image, i) => (
          <View style={styles.imageContainer} key={i}>
            <Image source={image} style={styles.image} />
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
    flexDirection: 'row',
    marginTop: spaces.M,
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: colors.LIGHT,
    borderRadius: radius.REGULAR,
    marginRight: spaces.M,
  },
  image: {
    width: 90,
    height: 90,
    transform: [{ rotate: '-20deg' }, { translateX: -spaces.S }, { translateY: -spaces.S }],
  },
});
