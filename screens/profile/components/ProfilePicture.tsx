import { View, StyleSheet, Pressable, Image, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { colors } from "@constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SMALL_ICON_SIZE } from "@constants/sizes";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import * as ImagePicker from "expo-image-picker";
import { ProfileImage } from "@models/profile";
import { MotiView } from "moti";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

const SIZE = 90;

interface ProfilePictureProps {
  image: ProfileImage;
  setImage: (image: ProfileImage) => void;
  photoUrl?: string;
}

export default function ProfilePicture({
  image,
  setImage,
  photoUrl,
}: ProfilePictureProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // The current URI of the image to be displayed
  const currentImageUri = image.uri || photoUrl;

  // Reset states when the image changes
  useEffect(() => {
    console.log("📸 Image actuelle:", currentImageUri);
    setIsImageLoaded(false);
    setHasImageError(false);
    setIsLoading(!!currentImageUri);
  }, [currentImageUri]);

  const pickImage = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à votre galerie pour sélectionner une photo.",
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Paramètres",
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
            },
          ],
        );
        return;
      }

      console.log("📷 Ouverture de la galerie...");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
        aspect: [1, 1],
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets?.[0]) {
        const selectedImage = result.assets[0];

        console.log("✅ Image sélectionnée:", {
          uri: selectedImage.uri,
          size: selectedImage.fileSize,
          dimensions: `${selectedImage.width}x${selectedImage.height}`,
        });

        if (
          selectedImage.fileSize &&
          selectedImage.fileSize > 5 * 1024 * 1024
        ) {
          Alert.alert(
            "Fichier trop volumineux",
            "Veuillez sélectionner une image de moins de 5MB.",
          );
          return;
        }

        setImage({ uri: selectedImage.uri, new: true });

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } else {
        console.log("❌ Sélection annulée");
      }
    } catch (error) {
      console.error("❌ Erreur sélection image:", error);

      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection de l'image.",
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // ✅ Gérer le succès de chargement (seulement si pas d'erreur)
  const handleImageLoad = () => {
    if (!hasImageError) {
      console.log("✅ Image chargée avec succès");
      setIsImageLoaded(true);
    }
    setIsLoading(false);
  };

  // ✅ Gérer l'erreur de chargement (priorité sur le succès)
  const handleImageError = (error: any) => {
    console.error("❌ Erreur chargement image:", {
      url: currentImageUri,
      error: error?.nativeEvent?.error || "Erreur inconnue",
      responseCode: error?.nativeEvent?.responseCode,
    });

    // ✅ Marquer comme erreur en priorité
    setHasImageError(true);
    setIsImageLoaded(false);
    setIsLoading(false);
  };

  const showImageOptions = () => {
    Alert.alert("Photo de profil", "Que souhaitez-vous faire ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Changer la photo", onPress: pickImage },
      ...(currentImageUri
        ? [
            {
              text: "Supprimer",
              style: "destructive" as const,
              onPress: () => {
                setImage({ uri: undefined, new: false });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              },
            },
          ]
        : []),
    ]);
  };

  // ✅ Améliorer la condition pour afficher le placeholder
  const shouldShowPlaceholder = !currentImageUri || hasImageError;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.imageContainer}
        onPress={currentImageUri ? showImageOptions : pickImage}
        accessibilityLabel="Photo de profil"
        accessibilityHint={
          currentImageUri
            ? "Appuyer pour modifier ou supprimer"
            : "Appuyer pour sélectionner une photo"
        }
      >
        {shouldShowPlaceholder ? (
          <View style={styles.placeholderContainer}>
            <FontAwesome
              name="user-circle"
              size={SIZE}
              color={hasImageError ? colors.RED : colors.BLUE}
            />
            {hasImageError && (
              <View style={styles.errorBadge}>
                <MaterialIcons name="error" size={16} color={colors.WHITE} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imageContainer}>
            {/* ✅ Skeleton loader seulement pendant le chargement sans erreur */}
            {isLoading && !hasImageError && (
              <MotiView
                from={{ opacity: 0.3 }}
                animate={{ opacity: 0.7 }}
                transition={{
                  type: "timing",
                  duration: 1000,
                  loop: true,
                }}
                style={[styles.image, styles.skeleton]}
              />
            )}

            <Image
              source={{ uri: currentImageUri }}
              style={[
                styles.image,
                (isLoading || !isImageLoaded) && styles.hiddenImage,
              ]}
              onLoad={handleImageLoad} // ✅ Utiliser onLoad au lieu de onLoadEnd
              onError={handleImageError}
              resizeMode="cover"
            />

            {/* ✅ Badge "nouveau" seulement si image valide */}
            {image.new && isImageLoaded && !hasImageError && (
              <View style={styles.newBadge}>
                <MaterialIcons
                  name="fiber-new"
                  size={12}
                  color={colors.WHITE}
                />
              </View>
            )}
          </View>
        )}

        <View
          style={[
            styles.iconContainer,
            hasImageError && styles.iconContainerError,
          ]}
        >
          <MaterialIcons
            name={currentImageUri ? "edit" : "add-a-photo"}
            size={SMALL_ICON_SIZE / 2}
            color={colors.WHITE}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: spaces.XL,
  },
  imageContainer: {
    width: SIZE,
    height: SIZE,
    position: "relative",
  },
  placeholderContainer: {
    width: SIZE,
    height: SIZE,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: radius.FULL,
    borderWidth: 2,
    borderColor: colors.DARK,
  },
  skeleton: {
    position: "absolute",
    backgroundColor: colors.GREY,
    zIndex: 1,
  },
  hiddenImage: {
    opacity: 0,
  },
  iconContainer: {
    position: "absolute",
    bottom: 0,
    width: SMALL_ICON_SIZE,
    height: SMALL_ICON_SIZE,
    left: "50%",
    transform: [
      { translateX: -SMALL_ICON_SIZE / 2 },
      { translateY: SMALL_ICON_SIZE / 2 },
    ],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.BLUE,
    borderRadius: radius.FULL,
    borderWidth: 2,
    borderColor: colors.WHITE,
    shadowColor: colors.DARK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainerError: {
    backgroundColor: colors.RED,
  },
  errorBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.RED,
    justifyContent: "center",
    alignItems: "center",
  },
  newBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.GREEN,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
