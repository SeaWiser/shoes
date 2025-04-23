import { Brand } from "../../../../types/brand";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { colors } from "../../../../constants/colors";
import { radius } from "../../../../constants/radius";
import { spaces } from "../../../../constants/spaces";
import { ICON_SIZE, IS_SMALL_SCREEN, SMALL_ICON_SIZE } from "../../../../constants/sizes";
import TextBoldL from "../../../../ui-components/texts/TextBoldL";
import { brands } from "../../../../data/brand";

type BrandItemProps = {
  item: Brand,
  selectedBrand: string,
  setSelectedBrand: (brand: string) => void,
  index: number;
}

export default function BrandItem({ item, selectedBrand, setSelectedBrand, index }: BrandItemProps) {
  const onPressBrand = () => {
    setSelectedBrand(item.name);
  };

  return (
    <TouchableOpacity onPress={onPressBrand} style={{
      marginLeft: index === 0 ? spaces.L : 0,
      marginRight: index === brands.length - 1 ? spaces.L : 0,
    }}>
      {item.name === selectedBrand ? (
        <View style={styles.selectedBrandContainer}>
          <View style={styles.iconContainer}>
            <Image source={item.logo} style={styles.image}></Image>
          </View>
          <TextBoldL style={styles.brandText}>{item.name.replace("-", " ")}</TextBoldL>
        </View>
      ) : (
        <View style={[styles.iconContainer, styles.unselectedBrandContainer]}>
          <Image source={item.logo} style={styles.image}></Image>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selectedBrandContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.FULL,
    backgroundColor: colors.BLUE,
    padding: IS_SMALL_SCREEN ? spaces.XS : spaces.S,
  },
  iconContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: radius.FULL,
    padding: spaces.S,
  },
  image: {
    width: IS_SMALL_SCREEN ? SMALL_ICON_SIZE : ICON_SIZE,
    height: IS_SMALL_SCREEN ? SMALL_ICON_SIZE : ICON_SIZE,
    resizeMode: "contain",
  },
  brandText: {
    color: colors.WHITE,
    marginHorizontal: spaces.M,
    textTransform: "capitalize",
  },
  unselectedBrandContainer: {
    marginTop: spaces.S,
  },
});