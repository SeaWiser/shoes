import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { shoes } from "@data/shoes";
import DetailsDescription from "@screens/details/components/DetailsDescription";
import DetailsImage from "@screens/details/components/DetailsImage";
import Gallery from "@screens/details/components/Gallery";
import Sizes from "@screens/details/components/Sizes";
import { ShoeSize } from "@models/shoe-size";
import CustomButton from "@ui-components/buttons/CustomButton";
import { spaces } from "@constants/spaces";
import { SCREEN_HEIGHT } from "@constants/sizes";
import { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useGetUserByUserIdQuery,
  useUpdateUserProfileMutation,
} from "@store/api/userApi";
import { useAuth } from "@store/api/authApi";
import AnimatedHeader from "@screens/details/components/AnimatedHeader";
import * as Haptics from "expo-haptics";
import { colors } from "@constants/colors";

type DetailsProps = {
  route: RouteProp<RootStackParamList, "Details">;
  navigation: NativeStackNavigationProp<RootStackParamList, "Details">;
};

export default function Details({ route, navigation }: DetailsProps) {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  // Utiliser le hook d'authentification Appwrite
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();

  // IMPORTANT: Utiliser l'ID de l'utilisateur authentifié pour la requête
  const userId = authUser?.$id;

  console.log("=== AUTH DEBUG ===");
  console.log("Auth user ID:", userId);
  console.log("Is authenticated:", isAuthenticated);

  // Récupérer le profil utilisateur avec l'userId (qui est l'ID d'auth)
  const {
    data: userProfile,
    refetch,
    isLoading: userLoading,
    error: userError,
  } = useGetUserByUserIdQuery(userId!, {
    skip: !userId,
  });

  const [updateUser, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  console.log("=== USER PROFILE DEBUG ===");
  console.log("User profile:", userProfile);
  console.log("User profile $id:", userProfile?.$id);

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
    console.log("Is authenticated:", isAuthenticated);
    console.log("User profile:", userProfile);
    console.log("Selected size:", selectedSize);

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
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShouldAnimate(true);

      const newItem = {
        id: `${data.id}_${Date.now()}`,
        name:
          (brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "") +
          " " +
          data.name,
        image: selectedImage,
        size: selectedSize,
        price: data.price,
        quantity: 1,
      };

      console.log("Nouvel article:", newItem);

      // Créer le nouveau panier
      const existingShoes = userProfile.cart?.shoes || [];
      const newShoes = [...existingShoes, newItem];
      const newTotalAmount =
        (userProfile.cart?.totalAmount || 0) + newItem.price;

      const cartData = {
        shoes: newShoes,
        totalAmount: newTotalAmount,
      };

      console.log("Nouveau panier:", {
        itemsCount: newShoes.length,
        totalAmount: newTotalAmount,
      });

      // IMPORTANT: Utiliser le $id du document utilisateur, pas l'ID d'auth
      const updatePayload = {
        documentId: userProfile.$id, // ID du document dans la collection users
        userId: userProfile.userId, // ID de l'utilisateur (pour la validation)
        cart: cartData,
      };

      console.log("Payload de mise à jour:", {
        documentId: updatePayload.documentId,
        userId: updatePayload.userId,
        cartItemsCount: cartData.shoes.length,
      });

      const result = await updateUser(updatePayload).unwrap();
      console.log("Mise à jour réussie");

      // Rafraîchir les données
      await refetch();

      // Feedback visuel
      Alert.alert(
        "Ajouté au panier ✓",
        `${newItem.name} (Taille ${selectedSize}) a été ajouté au panier.`,
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("=== ERREUR LORS DE L'AJOUT ===");
      console.error("Error:", error);

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

  // Afficher un loader pendant le chargement
  if (authLoading || userLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" color={colors.DARK} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedHeader
          shouldAnimate={shouldAnimate}
          setShouldAnimate={setShouldAnimate}
          cartCount={userProfile?.cart?.shoes?.length ?? 0}
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
    </View>
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
    height: SCREEN_HEIGHT,
  },
  container: {
    position: "relative",
    bottom: Platform.select({ android: 80, ios: 100 }),
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
