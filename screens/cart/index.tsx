import { View, StyleSheet, FlatList } from "react-native";
import { colors } from "@constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem from "@screens/cart/components/ListItem";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { radius } from "@constants/radius";
import CustomButton from "@ui-components/buttons/CustomButton";
import DashedLine from "@ui-components/separators/DashedLine";
import { IS_LARGE_SCREEN } from "@constants/sizes";

export default function Cart() {
  const state = useSelector((state: RootState) => state.cart);
  const { shoes, totalAmount } = state;

  if (shoes.length === 0) {
    return (
      <View style={styles.listEmptyContainer}>
        <TextBoldL>Votre panier est vide</TextBoldL>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={shoes}
        showsVerticalScrollIndicator={false}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => <ListItem item={item} />}
        style={styles.listContainer}
        ItemSeparatorComponent={() => <ItemSeparator height={spaces.L} />}
        numColumns={IS_LARGE_SCREEN ? 2 : 1}
      />
      <View style={styles.priceContainer}>
        <View style={styles.rowContainer}>
          <TextBoldXL>Sous total</TextBoldXL>
          <TextBoldXL>{totalAmount} €</TextBoldXL>
        </View>
        <View style={styles.rowContainer}>
          <TextBoldXL>Frais de port</TextBoldXL>
          <TextBoldXL>{Math.floor(totalAmount / 15)} €</TextBoldXL>
        </View>

        <DashedLine
          style={{ marginBottom: spaces.M, borderColor: colors.GREY }}
        />
        <View style={styles.rowContainer}>
          <TextBoldXL>Total</TextBoldXL>
          <TextBoldXL>
            {totalAmount + Math.floor(totalAmount / 15)} €
          </TextBoldXL>
        </View>
        <CustomButton
          text="Passer la commande"
          onPress={() => console.log}
        ></CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listEmptyContainer: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.LIGHT,
  },
  listContainer: {
    marginTop: spaces.M,
  },
  priceContainer: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: radius.REGULAR,
    borderTopRightRadius: radius.REGULAR,
    padding: spaces.XL,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spaces.M,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderColor: colors.GREY,
    borderStyle: "dashed",
    marginBottom: spaces.M,
  },
});
