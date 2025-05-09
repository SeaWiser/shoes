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
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/api/userApi";

export default function Cart() {
  const userId = useSelector((state: RootState) => state.user.id);
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  const [updateUser] = useUpdateUserMutation();
  // const state = useSelector((state: RootState) => state.cart);
  // const { shoes, totalAmount } = state;

  const totalAmount = user?.cart?.totalAmount;

  const removeShoesFromCart = (id: string) => {
    if (!user?.cart?.shoes || !user.cart.totalAmount) return;

    const shoesToRemove = user.cart.shoes.find((el) => el.id === id);
    if (!shoesToRemove?.price || !shoesToRemove.quantity) return;

    const newCart = {
      shoes: user.cart.shoes.filter((el) => el.id !== id),
      totalAmount:
        user.cart.totalAmount - shoesToRemove.price * shoesToRemove.quantity,
    };

    updateUser({
      id: userId,
      cart: newCart,
    });
  };

  const updateQuantity = (id: string, increase: boolean) => {
    const newCart = JSON.parse(JSON.stringify(user?.cart));
    const index = newCart.shoes.indexOf(
      newCart.shoes.find((el: any) => el.id === id),
    );
    if (increase) {
      newCart.shoes[index].quantity += 1;
      newCart.totalAmount += newCart.shoes[index].price;
    } else {
      newCart.shoes[index].quantity -= 1;
      newCart.totalAmount -= newCart.shoes[index].price;
    }
    updateUser({
      id: userId,
      cart: newCart,
    });
  };

  if (!user?.cart?.shoes?.length || !totalAmount) {
    return (
      <View style={styles.listEmptyContainer}>
        <TextBoldL>Votre panier est vide</TextBoldL>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={user?.cart?.shoes}
        showsVerticalScrollIndicator={false}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            removeShoesFromCart={removeShoesFromCart}
            updateQuantity={updateQuantity}
          />
        )}
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
