import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Import SafeAreaView
import { shoes } from "@data/shoes";
import DetailsDescription from "@screens/details/components/DetailsDescription";
import DetailsImage from "@screens/details/components/DetailsImage";
import Gallery from "@screens/details/components/Gallery";
import Sizes from "@screens/details/components/Sizes";
import { ShoeSize } from "@models/shoe-size";
import CustomButton from "@ui-components/buttons/CustomButton";
import { spaces } from "@constants/spaces";
import { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuthStore } from "../../store/authStore";
import { useUserById, useUpdateUserProfile } from "@hooks/queries/useUser";
import { useCartStore } from "../../store/cartStore";
import { CartShoe } from "@models/cart";
import AnimatedHeader from "@screens/details/components/AnimatedHeader";
import * as Haptics from "expo-haptics";
import { colors } from "@constants/colors";
import { convertImageToString } from "@utils/imageConverter";

type DetailsProps = {
  route: RouteProp<RootStackParamList, "Details">;
  navigation: NativeStackNavigationProp<RootStackParamList, "Details">;
};

export default function Details({ route, navigation }: DetailsProps) {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  const { user: authUser, isAuthenticated } = useAuthStore();
  const {
    data: userProfile,
    refetch,
    isLoading: userLoading,
  } = useUserById(authUser?.$id!, { enabled: !!authUser?.$id });
  const updateUserMutation = useUpdateUserProfile();
  const { addShoe, syncCart, shoes: cartShoes } = useCartStore();

  const [animatedCartCount, setAnimatedCartCount] = useState(cartShoes.length);

  const userId = authUser?.$id;
  const isUpdating = updateUserMutation.isPending;

  const data = shoes
    .find((el) => el.stock.find((item) => item.id === route.params.id))!
    .stock.find((item) => item.id === route.params.id)!;

  const brand = shoes.find((el) =>
    el.stock.find((item) => item.id === route.params.id),
  )?.brand;

  const images = data.items.map((item) => item.image);
  const [selectedImage, setSelectedImage] = useState(data.items[0].image);
  const [selectedSize, setSelectedSize] = useState<ShoeSize | undefined>();
  const [sizes, setSizes] = useState<number[] | undefined>(data.items[0].sizes);

  const addToCart = async () => {
    console.log("=== DEBUT addToCart ===");

    // Vérifications
    if (!isAuthenticated || !userId) {
      Alert.alert(
        "Connexion requise",
        "Vous devez vous connecter pour ajouter des articles au panier.",
        [
          {
            text: "Se connecter",
            onPress: () => navigation.navigate("Login" as any),
          },
          {
            text: "Annuler",
            style: "cancel",
          },
        ],
      );
      return;
    }

    if (!userProfile) {
      Alert.alert(
        "Erreur",
        "Profil utilisateur non trouvé. Veuillez vous reconnecter.",
      );
      return;
    }

    if (!selectedSize) {
      Alert.alert(
        "Taille requise",
        "Veuillez sélectionner une taille avant d'ajouter au panier.",
        [{ text: "OK" }],
      );
      return;
    }

    try {
      setAnimatedCartCount(cartShoes.length + 1);
      setShouldAnimate(true);

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Créer l'article avec conversion d'image
      const newItem: CartShoe = {
        id: `${data.id}_${Date.now()}`,
        name:
          (brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "") +
          " " +
          data.name,
        image: convertImageToString(selectedImage),
        size: selectedSize,
        price: data.price,
        quantity: 1,
      };

      console.log("Nouvel article:", newItem);

      // Ajouter à Zustand store en PREMIER (pour l'animation immédiate)
      addShoe(newItem);

      // Créer le nouveau panier pour Appwrite en utilisant les données Zustand mises à jour
      const updatedCartShoes = [...cartShoes, newItem];
      const newTotalAmount = updatedCartShoes.reduce(
        (total, shoe) => total + shoe.price * shoe.quantity,
        0,
      );

      const cartData = {
        shoes: updatedCartShoes,
        totalAmount: newTotalAmount,
      };

      // Mise à jour via Tanstack Query (en arrière-plan)
      await updateUserMutation.mutateAsync({
        documentId: userProfile.$id,
        userId: userProfile.userId,
        cart: cartData,
      });

      console.log("✅ Article ajouté au panier");

      // Feedback visuel
      Alert.alert(
        "Ajouté au panier ✓",
        `${newItem.name} (Taille ${selectedSize}) a été ajouté au panier.`,
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("=== ERREUR LORS DE L'AJOUT ===");
      console.error("Error:", error);

      // Rollback en cas d'erreur - resynchroniser avec les données serveur
      if (userProfile?.cart) {
        syncCart(userProfile.cart);
      }

      Alert.alert(
        "Erreur",
        "Impossible d'ajouter l'article au panier. Veuillez réessayer.",
        [{ text: "OK" }],
      );
    }
  };

  useEffect(() => {
    setSizes(data.items.find((el) => el.image === selectedImage)?.sizes);
    setSelectedSize(
      data.items.find((el) => el.image === selectedImage)?.sizes[0] as ShoeSize,
    );
  }, [selectedImage]);

  useEffect(() => {
    navigation.setOptions({
      title: data.gender === "m" ? "Shoes Homme" : "Shoes Femme",
    });
  }, [route.params.id]);

  useEffect(() => {
    if (userProfile?.cart && cartShoes.length === 0) {
      console.log("🔄 Synchronisation initiale du panier dans Details");
      syncCart(userProfile.cart);
    }
  }, [userProfile?.cart, syncCart, cartShoes.length]);

  useEffect(() => {
    setAnimatedCartCount(cartShoes.length);
  }, [cartShoes.length]);

  if (userLoading) {
    return (
      <SafeAreaView
        style={styles.activityIndicatorContainer}
        edges={["top", "bottom"]}
      >
        <ActivityIndicator size="large" color={colors.DARK} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <AnimatedHeader
          shouldAnimate={shouldAnimate}
          setShouldAnimate={setShouldAnimate}
          cartCount={animatedCartCount}
        />
        <View style={styles.container}>
          <DetailsImage source={selectedImage} />
          <DetailsDescription
            name={data.name}
            price={data.price}
            description={data.description}
            id={route.params.id}
          />
          <Gallery
            images={images}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
          />
          <Sizes
            sizes={sizes as ShoeSize[]}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          <View style={styles.btnContainer}>
            <CustomButton
              text={
                !isAuthenticated
                  ? "Se connecter pour acheter"
                  : isUpdating
                    ? "Ajout en cours..."
                    : "Ajouter au panier"
              }
              onPress={addToCart}
              isLoading={isUpdating}
              disabled={!isAuthenticated || !selectedSize || isUpdating}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.LIGHT,
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.LIGHT,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: spaces.XL,
  },
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    width: "80%",
    alignSelf: "center",
    maxWidth: 400,
    marginVertical: spaces.XL,
  },
});
