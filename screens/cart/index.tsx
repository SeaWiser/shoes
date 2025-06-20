import { View, StyleSheet, FlatList } from "react-native";
import { colors } from "@constants/colors";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem, { SkeletonProps } from "@screens/cart/components/ListItem";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { radius } from "@constants/radius";
import DashedLine from "@ui-components/separators/DashedLine";
import { IS_LARGE_SCREEN } from "@constants/sizes";
import { useEffect, useMemo, useState, useCallback, useRef, memo } from "react";
import { initStripe } from "@stripe/stripe-react-native";
import PaymentButton from "@screens/cart/components/PaymentButton";
import PaymentSuccess from "@screens/cart/components/PaymentSuccess";
import { CartShoe, Cart as CartType } from "@models/cart";
import { ShoeSize } from "@models/shoe-size";
import { Skeleton } from "moti/skeleton";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUserById, useUpdateUserProfile } from "@hooks/queries/useUser";
import { useFetchPublishableKey } from "@hooks/queries/useStripe";
import { useDebouncedCallback } from "use-debounce";

const CartItemList = memo(
  ({
    items,
    isLoading,
    onRemove,
    onUpdateQuantity,
  }: {
    items: CartShoe[];
    isLoading: boolean;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, increase: boolean) => void;
  }) => {
    const placeholderList: CartShoe[] = useMemo(
      () =>
        Array.from({ length: 3 }).map((_, i) => ({
          id: i.toString(),
          name: "Loading...",
          image: "",
          size: 40 as ShoeSize,
          price: 0,
          quantity: 1,
        })),
      [],
    );

    return (
      <FlatList<CartShoe>
        data={isLoading ? placeholderList : items}
        showsVerticalScrollIndicator={false}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            removeShoesFromCart={onRemove}
            updateQuantity={onUpdateQuantity}
            isLoading={isLoading}
          />
        )}
        style={styles.listContainer}
        ItemSeparatorComponent={() => <ItemSeparator height={spaces.L} />}
        numColumns={IS_LARGE_SCREEN ? 2 : 1}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    );
  },
);

// Component for the empty state
const EmptyCart = memo(({ message }: { message: string }) => (
  <View style={styles.listEmptyContainer}>
    <TextBoldL>{message}</TextBoldL>
  </View>
));

// Component for the price summary
const PriceSummary = memo(
  ({
    totalAmount,
    isLoading,
    isSyncing,
    isPaymentInitializing,
  }: {
    totalAmount: number;
    isLoading: boolean;
    isSyncing: boolean;
    isPaymentInitializing?: boolean;
  }) => (
    <>
      <Skeleton.Group show={isLoading}>
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
      </Skeleton.Group>
    </>
  ),
);

export default function Cart() {
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [isStripeInitialized, setIsStripeInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPaymentInitializing, setIsPaymentInitializing] = useState(false);

  const { user: authUser, isAuthenticated } = useAuthStore();
  const {
    shoes: cartShoes,
    totalAmount: cartTotalAmount,
    removeShoe,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    syncCart,
  } = useCartStore();

  const { data: userProfile, isLoading: isLoadingProfile } = useUserById(
    authUser?.$id!,
    { enabled: !!authUser?.$id },
  );

  const updateUserMutation = useUpdateUserProfile();
  const { data: stripeConfig } = useFetchPublishableKey();

  const isInitialSyncDoneRef = useRef(false);
  const lastSyncedDataRef = useRef<string>("");
  // Add a ref to ignore data from our own updates
  const isOurUpdateRef = useRef(false);

  // Debounce modified to not synchronize during payment initialization
  const debouncedSync = useDebouncedCallback(
    async (cartData: CartType) => {
      if (
        !userProfile?.$id ||
        !authUser?.$id ||
        !isInitialSyncDoneRef.current ||
        isPaymentInitializing // Block sync during payment initialization
      ) {
        if (isPaymentInitializing) {
          console.log(
            "⏭️ Synchronisation bloquée - paiement en cours d'initialisation",
          );
        }
        return;
      }

      const cartString = JSON.stringify(cartData);

      // Avoid synchronizing if nothing has changed
      if (cartString === lastSyncedDataRef.current) {
        console.log("⏭️ Synchronisation ignorée - données identiques");
        return;
      }

      try {
        setIsSyncing(true);
        // Mark that this update came from us
        isOurUpdateRef.current = true;
        console.log("🔄 Synchronisation vers Appwrite...");

        await updateUserMutation.mutateAsync({
          documentId: userProfile.$id,
          userId: authUser.$id,
          cart: cartData,
        });

        lastSyncedDataRef.current = cartString;
        console.log("✅ Panier synchronisé");
      } catch (error) {
        console.error("❌ Erreur sync:", error);
        if (userProfile?.cart) {
          syncCart(userProfile.cart);
        }
      } finally {
        setIsSyncing(false);
        // Reset the flag after a delay to allow time for useUserById to update
        setTimeout(() => {
          isOurUpdateRef.current = false;
        }, 1000);
      }
    },
    1500,
    { maxWait: 5000 },
  );

  // Initial synchronization modified to avoid loops
  useEffect(() => {
    if (
      userProfile?.cart &&
      isAuthenticated &&
      !isInitialSyncDoneRef.current &&
      !isOurUpdateRef.current // Ignore if it's our own update
    ) {
      console.log("🔍 Vérification synchronisation initiale...");

      const appwriteCart = userProfile.cart;
      const localCart = { shoes: cartShoes, totalAmount: cartTotalAmount };

      const appwriteString = JSON.stringify(appwriteCart);
      const localString = JSON.stringify(localCart);

      if (appwriteString !== localString) {
        console.log("📥 Synchronisation initiale depuis Appwrite");
        console.log("Appwrite data:", appwriteString);
        console.log("Local data:", localString);
        syncCart(appwriteCart);
        lastSyncedDataRef.current = appwriteString;
      } else {
        console.log("✅ Données déjà synchronisées");
        lastSyncedDataRef.current = localString;
      }

      isInitialSyncDoneRef.current = true;
      console.log("✅ Synchronisation initiale terminée");
    }
  }, [userProfile?.$id, isAuthenticated]);

  // Synchronization of local changes - more restrictive
  useEffect(() => {
    if (
      isAuthenticated &&
      userProfile?.$id &&
      isInitialSyncDoneRef.current &&
      !isOurUpdateRef.current
    ) {
      const cartData = { shoes: cartShoes, totalAmount: cartTotalAmount };
      console.log("🔄 Déclenchement sync locale");
      debouncedSync(cartData);
    }
  }, [cartShoes, cartTotalAmount, isAuthenticated, userProfile?.$id]);

  // Reset synchronization if user changes
  useEffect(() => {
    if (!isAuthenticated || !authUser?.$id) {
      console.log("🔄 Reset synchronisation - utilisateur déconnecté");
      isInitialSyncDoneRef.current = false;
      lastSyncedDataRef.current = "";
      isOurUpdateRef.current = false;
    }
  }, [isAuthenticated, authUser?.$id]);

  // Stripe initialization (unchanged)
  useEffect(() => {
    if (stripeConfig?.publishableKey && !isStripeInitialized) {
      initStripe({ publishableKey: stripeConfig.publishableKey })
        .then(() => {
          setIsStripeInitialized(true);
          console.log("✅ Stripe initialisé");
        })
        .catch(console.error);
    }
  }, [stripeConfig?.publishableKey, isStripeInitialized]);

  // Callbacks
  const removeShoesFromCart = useCallback(
    (id: string) => {
      console.log("🗑️ Suppression locale:", id);
      removeShoe(id);
    },
    [removeShoe],
  );

  const updateQuantity = useCallback(
    (id: string, increase: boolean) => {
      console.log(
        `📊 Modification quantité locale:`,
        id,
        increase ? "+1" : "-1",
      );
      if (increase) {
        increaseQuantity(id);
      } else {
        decreaseQuantity(id);
      }
    },
    [increaseQuantity, decreaseQuantity],
  );

  const resetCart = useCallback(async () => {
    try {
      setIsPaymentDone(false);
      clearCart();

      if (userProfile?.$id && authUser?.$id) {
        setIsSyncing(true);
        isOurUpdateRef.current = true; // Mark as our update
        console.log("🔄 Reset panier en base...");

        await updateUserMutation.mutateAsync({
          documentId: userProfile.$id,
          userId: authUser.$id,
          cart: { shoes: [], totalAmount: 0 },
        });

        lastSyncedDataRef.current = JSON.stringify({
          shoes: [],
          totalAmount: 0,
        });
        console.log("✅ Panier réinitialisé");
      }
    } catch (error) {
      console.error("❌ Erreur reset:", error);
    } finally {
      setIsSyncing(false);
      setTimeout(() => {
        isOurUpdateRef.current = false;
      }, 1000);
    }
  }, [userProfile?.$id, authUser?.$id, clearCart, updateUserMutation]);

  // Rendering conditions (unchanged)
  if (!isAuthenticated) {
    return <EmptyCart message="Connectez-vous pour voir votre panier" />;
  }

  if (!isLoadingProfile && cartShoes.length === 0) {
    return <EmptyCart message="Votre panier est vide" />;
  }

  const hasItems = cartShoes.length > 0;

  return (
    <View style={styles.container}>
      <CartItemList
        items={cartShoes}
        isLoading={isLoadingProfile}
        onRemove={removeShoesFromCart}
        onUpdateQuantity={updateQuantity}
      />

      <View style={styles.priceContainer}>
        <PriceSummary
          totalAmount={cartTotalAmount}
          isLoading={isLoadingProfile}
          isSyncing={isSyncing}
        />

        <PaymentButton
          isReady={hasItems && !isSyncing && !isLoadingProfile}
          setIsPaymentDone={setIsPaymentDone}
          totalAmount={cartTotalAmount}
          // ✅ Passer les callbacks pour gérer l'état d'initialisation
          onInitializationStart={() => setIsPaymentInitializing(true)}
          onInitializationEnd={() => setIsPaymentInitializing(false)}
        />
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
    shadowColor: colors.DARK,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  syncIndicator: {
    backgroundColor: colors.LIGHT,
    padding: spaces.S,
    borderRadius: radius.REGULAR,
    marginBottom: spaces.M,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: spaces.S,
  },
  syncText: {
    color: colors.BLUE,
    fontSize: 12,
  },
});
