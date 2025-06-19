import React from "react";
import { View, StyleSheet, Image, Pressable, Platform } from "react-native";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import TextBoldM from "@ui-components/texts/TextBoldM";
import Feather from "@expo/vector-icons/Feather";
import { ICON_SIZE } from "@constants/sizes";
import { colors } from "@constants/colors";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import { CartItem } from "@models/cart";
import { Skeleton } from "moti/skeleton";

export const SkeletonProps = {
  colorMode: "light" as const,
  radius: radius.REGULAR,
};

type ListItemProps = {
  item: CartItem;
  removeShoesFromCart: (id: string) => void;
  updateQuantity: (id: string, increase: boolean) => void;
  isLoading: boolean;
};

export default function ListItem({
  item,
  removeShoesFromCart,
  updateQuantity,
  isLoading,
}: ListItemProps) {
  const removeShoes = () => {
    removeShoesFromCart(item.id);
  };

  const increaseShoesQuantity = () => {
    updateQuantity(item.id, true);
  };

  const decreaseShoesQuantity = () => {
    updateQuantity(item.id, false);
  };

  return (
    <View style={styles.container}>
      <Skeleton.Group show={isLoading}>
        <View style={styles.leftContainer}>
          <Skeleton width={120} {...SkeletonProps}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} />
            </View>
          </Skeleton>
          <View style={styles.columnContainer}>
            <Skeleton {...SkeletonProps}>
              <TextBoldL>{item.name}</TextBoldL>
            </Skeleton>
            <Skeleton {...SkeletonProps}>
              <TextBoldL>{item.price} €</TextBoldL>
            </Skeleton>
            <Skeleton {...SkeletonProps}>
              <View style={styles.quantityContainer}>
                <Pressable
                  style={[
                    styles.operationSignContainer,
                    styles.substractSignContainer,
                  ]}
                  onPress={decreaseShoesQuantity}
                >
                  <TextBoldXL style={styles.minusText}>-</TextBoldXL>
                </Pressable>
                <TextBoldM style={styles.quantityText}>
                  {item.quantity}
                </TextBoldM>
                <Pressable
                  style={[
                    styles.operationSignContainer,
                    styles.addSignContainer,
                  ]}
                  onPress={increaseShoesQuantity}
                >
                  <TextBoldXL style={styles.plusText}>+</TextBoldXL>
                </Pressable>
              </View>
            </Skeleton>
          </View>
        </View>

        <View style={[styles.rightContainer, styles.columnContainer]}>
          <Skeleton {...SkeletonProps}>
            <TextBoldL>{item.size}</TextBoldL>
          </Skeleton>
          <Skeleton {...SkeletonProps}>
            <Feather
              name="trash-2"
              size={ICON_SIZE}
              color={colors.GREY}
              suppressHighlighting={true}
              onPress={removeShoes}
            />
          </Skeleton>
        </View>
      </Skeleton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 140,
    justifyContent: "space-between",
    paddingVertical: spaces.XS,
    paddingHorizontal: spaces.L,
  },
  leftContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 120,
    height: "100%",
    backgroundColor: colors.WHITE,
    borderRadius: radius.REGULAR,
    marginRight: spaces.L,
  },
  image: {
    width: 120,
    height: 120,
    transform: [
      { rotate: "-20deg" },
      { translateX: -spaces.S },
      { translateY: -spaces.S },
    ],
  },
  columnContainer: {
    justifyContent: "space-between",
    paddingVertical: spaces.M,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  operationSignContainer: {
    width: spaces.XL,
    height: spaces.XL,
    borderRadius: radius.FULL,
    justifyContent: "center",
    alignItems: "center",
  },
  substractSignContainer: {
    backgroundColor: colors.WHITE,
  },
  minusText: {
    flex: Platform.select({ android: 1 }),
  },
  addSignContainer: {
    backgroundColor: colors.BLUE,
  },
  plusText: {
    color: colors.WHITE,
  },
  quantityText: {
    marginHorizontal: spaces.M,
  },
  rightContainer: {
    alignItems: "center",
  },
});
