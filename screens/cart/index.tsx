import { View, StyleSheet, FlatList, ImageSourcePropType } from "react-native";
import { colors } from "@constants/colors";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem, { SkeletonProps } from "@screens/cart/components/ListItem";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { radius } from "@constants/radius";
import DashedLine from "@ui-components/separators/DashedLine";
import { IS_LARGE_SCREEN } from "@constants/sizes";
import { useUpdateUserProfileMutation } from "@store/api/userApi";
import { useAuth } from "@store/api/authApi";
import { useProfileCreation } from "@hooks/useProfileCreation";
import { useFetchPublishableKeyQuery } from "@store/api/stripe";
import { useEffect, useMemo, useState } from "react";
import { initStripe } from "@stripe/stripe-react-native";
import PaymentButton from "@screens/cart/components/PaymentButton";
import PaymentSuccess from "@screens/cart/components/PaymentSuccess";
import { CartItem, Cart as CartType } from "@models/cart";
import { Skeleton } from "moti/skeleton";

export default function Cart() {
  const placeholderList: CartItem[] = useMemo(() => {
    return Array.from({ length: 3 }).map((_, i): any => {
      return { id: i.toString() };
    });
  }, []);

  const [isPaymentDone, setIsPaymentDone] = useState(false);

  const { user: authUser } = useAuth();
  const { appwriteUserProfile, isLoadingProfile } = useProfileCreation();

  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [isStripeInitialized, setIsStripeInitialized] = useState(false);

  const { data } = useFetchPublishableKeyQuery();

  useEffect(() => {
    if (data?.publishableKey) {
      initStripe({ publishableKey: data.publishableKey }).then(() =>
        setIsStripeInitialized(true),
      );
    }
  }, [data]);

  const resetCart = () => {
    setIsPaymentDone(false);
    if (appwriteUserProfile && authUser) {
      updateUserProfile({
        documentId: appwriteUserProfile.$id,
        userId: authUser.$id,
        cart: {
          shoes: [],
          totalAmount: 0,
        },
      });
    }
  };

  const totalAmount = appwriteUserProfile?.cart?.totalAmount ?? 0;

  const removeShoesFromCart = (id: string) => {
    if (!appwriteUserProfile?.cart?.shoes || !authUser) return;

    const shoesToRemove = appwriteUserProfile.cart.shoes.find(
      (el) => el.id === id,
    );
    if (!shoesToRemove) return;

    const newCart = {
      shoes: appwriteUserProfile.cart.shoes.filter((el) => el.id !== id),
      totalAmount:
        appwriteUserProfile.cart.totalAmount -
        shoesToRemove.price * shoesToRemove.quantity,
    };

    updateUserProfile({
      documentId: appwriteUserProfile.$id,
      userId: authUser.$id,
      cart: newCart,
    });
  };

  const updateQuantity = (id: string, increase: boolean) => {
    if (!appwriteUserProfile?.cart || !authUser) return;

    const newCart = JSON.parse(JSON.stringify(appwriteUserProfile.cart));
    const index = newCart.shoes.findIndex((el: any) => el.id === id);

    if (index === -1) return;

    if (increase) {
      newCart.shoes[index].quantity += 1;
      newCart.totalAmount += newCart.shoes[index].price;
    } else {
      newCart.shoes[index].quantity -= 1;
      newCart.totalAmount -= newCart.shoes[index].price;
    }

    updateUserProfile({
      documentId: appwriteUserProfile.$id,
      userId: authUser.$id,
      cart: newCart,
    });
  };

  if (!appwriteUserProfile?.cart?.shoes?.length && !isLoadingProfile) {
    return (
      <View style={styles.listEmptyContainer}>
        <TextBoldL>Votre panier est vide</TextBoldL>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<CartItem>
        data={
          !isLoadingProfile ? appwriteUserProfile?.cart?.shoes : placeholderList
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            removeShoesFromCart={removeShoesFromCart}
            updateQuantity={updateQuantity}
            isLoading={isLoadingProfile}
          />
        )}
        style={styles.listContainer}
        ItemSeparatorComponent={() => <ItemSeparator height={spaces.L} />}
        numColumns={IS_LARGE_SCREEN ? 2 : 1}
      />
      <View style={styles.priceContainer}>
        <Skeleton.Group show={isLoadingProfile}>
          <View style={styles.rowContainer}>
            <TextBoldXL>Sous total</TextBoldXL>
            <Skeleton {...SkeletonProps}>
              <TextBoldXL>{totalAmount} €</TextBoldXL>
            </Skeleton>
          </View>
          <View style={styles.rowContainer}>
            <TextBoldL>Livraison</TextBoldL>
            <Skeleton {...SkeletonProps}>
              <TextBoldL>0 €</TextBoldL>
            </Skeleton>
          </View>
          <DashedLine style={styles.dashedLine} />
          <View style={styles.rowContainer}>
            <TextBoldXL>Total</TextBoldXL>
            <Skeleton {...SkeletonProps}>
              <TextBoldXL>{totalAmount} €</TextBoldXL>
            </Skeleton>
          </View>
          <PaymentButton
            isReady={isStripeInitialized}
            setIsPaymentDone={setIsPaymentDone}
          />
        </Skeleton.Group>
      </View>
      {isPaymentDone && <PaymentSuccess onPress={resetCart} />}
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
    borderWidth: 1,
    borderColor: colors.GREY,
    borderStyle: "dashed",
    marginBottom: spaces.M,
  },
});
