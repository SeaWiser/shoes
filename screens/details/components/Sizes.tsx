import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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

export default function Sizes({ sizes, selectedSize, setSelectedSize }: SizesProps) {
  const shoeSizes: ShoeSize[] = [37, 38, 39, 40, 41, 42, 43, 44, 45];

  console.log(selectedSize);
  return (
    <View style={styles.container}>
      <TextBoldL style={styles.title}>Tailles</TextBoldL>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {shoeSizes.map((size) => (
          <TouchableOpacity
            onPress={() => setSelectedSize(size)}
            activeOpacity={0.8}
            key={size}
            style={[
              styles.sizeContainer,
              selectedSize === size
                ? styles.selectedSizeContainer
                : sizes.includes(size)
                  ? styles.availableSizeContainer
                  : styles.unavailableSizeContainer,
            ]}
          >
            <TextMediumM style={[selectedSize === size ? styles.selectedSizeText : styles.sizeText]}>
              {size}
            </TextMediumM>
          </TouchableOpacity>
        ))}
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
  },
  sizeContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.FULL,
    backgroundColor: colors.LIGHT,
    marginRight: spaces.M,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: spaces.S,
  },
  selectedSizeContainer: {
    backgroundColor: colors.BLUE,
    borderColor: colors.BLUE,
    elevation: 4,
    shadowColor: colors.DARK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  availableSizeContainer: {
    backgroundColor: colors.LIGHT,
    borderColor: colors.BLUE,
  },
  unavailableSizeContainer: {
    backgroundColor: colors.WHITE,
    borderColor: colors.GREY,
  },
  sizeText: {
    color: colors.DARK,
  },
  selectedSizeText: {
    color: colors.WHITE,
  },
});
