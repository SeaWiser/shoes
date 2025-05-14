import { StyleSheet, View, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ShoeStock } from "@models/shoe";
import { colors } from "@constants/colors";
import { radius } from "@constants/radius";
import { spaces } from "@constants/spaces";
import {
  IS_LARGE_SCREEN,
  SCREEN_WIDTH,
  SMALL_ICON_SIZE,
} from "@constants/sizes";
import TextMediumS from "@ui-components/texts/TextMediumS";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumM from "@ui-components/texts/TextMediumM";
import { colors as iconColors } from "@constants/colors";
import Touchable from "@ui-components/touchable/Touchable";

type VerticalCardProps = {
  item: ShoeStock;
  listScreen?: boolean;
  onPress?: () => void;
  isFavorite?: boolean;
};

export default function VerticalCard({
  item,
  listScreen = false,
  onPress,
  isFavorite = false,
}: VerticalCardProps) {
  const itemColors = item.items.map((elem) => elem.color);
  console.log(itemColors);
  return (
    <View style={styles.container}>
      <Touchable onPress={onPress}>
        <View style={styles.touchableContainer}>
          {isFavorite ? (
            <AntDesign
              name="star"
              size={SMALL_ICON_SIZE}
              color={iconColors.BLUE}
              style={styles.favoritesIcon}
            />
          ) : null}
          <View style={styles.imageContainer}>
            <Image source={item.items[0].image} style={styles.image}></Image>
          </View>
          <View
            style={[
              styles.descriptionContainer,
              { flex: listScreen ? 1 : IS_LARGE_SCREEN ? 0.7 : 0.2 },
            ]}
          >
            <View>
              <TextMediumS blue>TOP VENTE</TextMediumS>
              <TextBoldL style={styles.itemName}>{item.name}</TextBoldL>
            </View>
            {listScreen ? (
              <View style={styles.bottomDescriptionContainer}>
                <View style={styles.priceContainer}>
                  <TextMediumM>{item.price} €</TextMediumM>
                </View>
                <View style={styles.colorsContainer}>
                  {itemColors.map((color) => (
                    <View
                      key={color}
                      style={[styles.colorItem, { backgroundColor: color }]}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <TextMediumM>{item.price} €</TextMediumM>
            )}
          </View>
          {listScreen ? null : (
            <View style={styles.btn}>
              <AntDesign name="plus" size={24} color={colors.WHITE} />
            </View>
          )}
        </View>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: IS_LARGE_SCREEN ? SCREEN_WIDTH / 3.5 : 180,
    height: "98%",
    backgroundColor: colors.WHITE,
    borderRadius: radius.REGULAR,
    elevation: 4,
    shadowColor: colors.DARK,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
  },
  touchableContainer: {
    width: "100%",
    height: "100%",
    padding: spaces.S,
    paddingVertical: 2,
  },
  favoritesIcon: {
    position: "absolute",
    top: spaces.M,
    left: spaces.M,
  },
  imageContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    transform: [
      { rotate: "-20deg" },
      { translateX: -spaces.S },
      { translateY: -spaces.S },
    ],
  },
  descriptionContainer: {
    justifyContent: "space-between",
    padding: spaces.S,
  },
  itemName: {
    marginTop: spaces.S,
  },
  bottomDescriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceContainer: {
    width: "50%",
  },
  colorsContainer: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "flex-end",
  },
  colorItem: {
    width: spaces.M,
    height: spaces.M,
    borderRadius: radius.FULL,
    marginHorizontal: spaces.XS,
    borderWidth: 1,
    borderColor: colors.GREY,
  },
  btn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.BLUE,
    borderTopLeftRadius: radius.REGULAR,
    borderBottomRightRadius: radius.REGULAR,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
  },
});
