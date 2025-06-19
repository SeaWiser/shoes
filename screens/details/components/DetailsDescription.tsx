import { StyleSheet, View, Alert, Pressable } from "react-native";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumM from "@ui-components/texts/TextMediumM";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ICON_SIZE } from "@constants/sizes";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import {
  useGetUserByIdQuery,
  useToggleFavoriteMutation,
} from "@store/api/userApi";
import { useAuth } from "@store/api/authApi";
import { useEffect, useState, useRef } from "react";
import { MotiView, AnimatePresence } from "moti";

type DetailsDescriptionProps = {
  name: string;
  price: number;
  description: string;
  id: string;
};

export default function DetailsDescription({
  name,
  price,
  description,
  id,
}: DetailsDescriptionProps) {
  const { user: authUser, isAuthenticated } = useAuth();
  const { userId: reduxUserId } = useSelector((state: RootState) => state.auth);
  const userId = authUser?.$id || reduxUserId;

  const { data: user, refetch } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });
  const [toggleFavorite, { isLoading }] = useToggleFavoriteMutation();

  // Status for optimistic update
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Ref to track whether a mutation is in progress
  const mutationInProgress = useRef(false);

  const actualIsFavorite = user?.favoriteIds?.includes(id) || false;
  const isFavorite =
    optimisticFavorite !== null ? optimisticFavorite : actualIsFavorite;

  // Synchronize the optimistic state with the actual state after the mutation
  useEffect(() => {
    if (!mutationInProgress.current && optimisticFavorite !== null) {
      setOptimisticFavorite(null);
    }
  }, [actualIsFavorite]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !userId) {
      Alert.alert(
        "Required Authentication",
        "You must be logged in to add items to your favorites.",
        [{ text: "OK" }],
      );
      return;
    }

    if (!user || mutationInProgress.current) {
      return;
    }

    // Haptic feedback pour une meilleure expérience
    try {
      const Haptics = await import("expo-haptics");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    // Animation et optimistic update
    setIsAnimating(true);
    setOptimisticFavorite(!isFavorite);
    mutationInProgress.current = true;

    toggleFavorite({
      userId,
      documentId: user.$id,
      shoeId: id,
    })
      .unwrap()
      .then(() => {
        refetch();
      })
      .catch((error) => {
        console.error("Error updating favorites:", error);
        setOptimisticFavorite(actualIsFavorite);
        Alert.alert(
          "Error",
          "Unable to update your favorites. Please try again.",
          [{ text: "OK" }],
        );
      })
      .finally(() => {
        mutationInProgress.current = false;
        setTimeout(() => setIsAnimating(false), 300);
      });
  };

  return (
    <View style={styles.descriptionContainer}>
      <View>
        <TextMediumM blue style={styles.textSpacing}>
          MEILLEUR CHOIX
        </TextMediumM>
        <View style={styles.nameAndFavoriteContainer}>
          <TextBoldXL style={styles.textSpacing}>{name}</TextBoldXL>

          <Pressable
            onPress={handleToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.favoriteButton}
          >
            <AnimatePresence>
              {isFavorite ? (
                <MotiView
                  key="filled"
                  from={{
                    scale: isAnimating ? 0 : 1,
                    opacity: isAnimating ? 0 : 1,
                    rotate: isAnimating ? "180deg" : "0deg",
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: "0deg",
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    rotate: "-180deg",
                  }}
                  transition={{
                    type: "timing",
                    duration: 300,
                    scale: {
                      type: "spring",
                      damping: 15,
                      stiffness: 300,
                    },
                  }}
                  style={styles.iconContainer}
                >
                  <AntDesign
                    name="star"
                    size={ICON_SIZE}
                    color={colors.BLUE}
                    suppressHighlighting={true}
                  />
                </MotiView>
              ) : (
                <MotiView
                  key="outline"
                  from={{
                    scale: isAnimating ? 1.2 : 1,
                    opacity: isAnimating ? 0 : 1,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: 1.2,
                    opacity: 0,
                  }}
                  transition={{
                    type: "timing",
                    duration: 200,
                  }}
                  style={styles.iconContainer}
                >
                  <AntDesign
                    name="staro"
                    size={ICON_SIZE}
                    color={colors.BLUE}
                    suppressHighlighting={true}
                  />
                </MotiView>
              )}
            </AnimatePresence>

            {/* Particle effect for the favorite */}
            {isAnimating && isFavorite && (
              <>
                {[...Array(6)].map((_, index) => (
                  <MotiView
                    key={`particle-${index}`}
                    from={{
                      opacity: 1,
                      scale: 0,
                      translateX: 0,
                      translateY: 0,
                    }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      translateX: Math.cos((index * 60 * Math.PI) / 180) * 25,
                      translateY: Math.sin((index * 60 * Math.PI) / 180) * 25,
                    }}
                    transition={{
                      type: "timing",
                      duration: 600,
                      delay: index * 50,
                    }}
                    style={styles.particle}
                  >
                    <View style={styles.particleDot} />
                  </MotiView>
                ))}
              </>
            )}
          </Pressable>
        </View>
      </View>
      <TextBoldL style={styles.textSpacing}>{price} €</TextBoldL>
      <TextMediumM style={styles.descriptionText}>{description}</TextMediumM>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    paddingHorizontal: spaces.L,
  },
  textSpacing: {
    marginBottom: spaces.S,
  },
  nameAndFavoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descriptionText: {
    color: colors.GREY,
  },
  favoriteButton: {
    position: "relative",
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  particle: {
    position: "absolute",
    top: ICON_SIZE / 2 - 2,
    left: ICON_SIZE / 2 - 2,
  },
  particleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.BLUE,
  },
});
