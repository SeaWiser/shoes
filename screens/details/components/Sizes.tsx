import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumM from "@ui-components/texts/TextMediumM";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import { radius } from "@constants/radius";
import { ShoeSize } from "@models/shoe-size";

type SizesProps = {
  sizes: ShoeSize[];
  selectedSize: ShoeSize | undefined;
  setSelectedSize: (size: ShoeSize) => void;
};

export default function Sizes({
  sizes,
  selectedSize,
  setSelectedSize,
}: SizesProps) {
  const shoeSizes: ShoeSize[] = [37, 38, 39, 40, 41, 42, 43, 44, 45];

  const handleSizePress = (size: ShoeSize) => {
    if (sizes.includes(size)) {
      setSelectedSize(size);
    }
  };

  const getSizeStyle = (size: ShoeSize) => {
    const isSelected = selectedSize === size;
    const isAvailable = sizes.includes(size);

    if (isSelected) {
      return styles.selectedSizeContainer;
    } else if (isAvailable) {
      return styles.availableSizeContainer;
    } else {
      return styles.unavailableSizeContainer;
    }
  };

  const getTextStyle = (size: ShoeSize) => {
    const isSelected = selectedSize === size;
    const isAvailable = sizes.includes(size);

    if (isSelected) {
      return styles.selectedSizeText;
    } else if (isAvailable) {
      return styles.availableSizeText;
    } else {
      return styles.unavailableSizeText;
    }
  };

  return (
    <View style={styles.container}>
      <TextBoldL style={styles.title}>Tailles</TextBoldL>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {shoeSizes.map((size) => {
          const isAvailable = sizes.includes(size);

          return (
            <TouchableOpacity
              onPress={() => handleSizePress(size)}
              activeOpacity={isAvailable ? 0.7 : 1}
              disabled={!isAvailable}
              key={size}
              style={[styles.sizeContainer, getSizeStyle(size)]}
            >
              <TextMediumM style={getTextStyle(size)}>{size}</TextMediumM>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spaces.L,
  },
  title: {
    marginLeft: spaces.L,
    marginBottom: spaces.M,
    color: colors.DARK,
  },
  contentContainer: {
    paddingHorizontal: spaces.L,
    paddingBottom: Platform.OS === "android" ? spaces.M : spaces.S,
  },
  sizeContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spaces.M,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginBottom: spaces.XS,
  },
  selectedSizeContainer: {
    backgroundColor: colors.BLUE,
    borderColor: colors.BLUE,
    ...(Platform.OS === "android" && {
      elevation: 6,
    }),
    ...(Platform.OS === "ios" && {
      shadowColor: colors.DARK,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    }),
  },
  // ✅ Taille disponible
  availableSizeContainer: {
    backgroundColor: colors.WHITE,
    borderColor: colors.BLUE,
    ...(Platform.OS === "android" && {
      elevation: 2,
    }),
    ...(Platform.OS === "ios" && {
      shadowColor: colors.BLUE,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    }),
  },
  unavailableSizeContainer: {
    backgroundColor: colors.LIGHT_GREY,
    borderColor: colors.GREY,
    opacity: 0.5,
  },
  selectedSizeText: {
    color: colors.WHITE,
    fontWeight: "bold",
  },
  availableSizeText: {
    color: colors.BLUE,
    fontWeight: "600",
  },
  unavailableSizeText: {
    color: colors.GREY,
    textDecorationLine: "line-through",
  },
});
