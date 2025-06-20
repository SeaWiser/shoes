import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { colors } from "@constants/colors";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  appReadyHandler: () => void;
  isDataReady?: boolean;
  progress?: number;
  currentStep?: string;
}

export default function SplashScreen({
  appReadyHandler,
  isDataReady = false,
  progress = 0,
  currentStep = "Chargement...",
}: SplashScreenProps) {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [minimumTimeReached, setMinimumTimeReached] = useState(false);

  // ✅ Temps minimum de 1.5 secondes pour une UX confortable
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimeReached(true);
    }, 1500); // ✅ Augmenté à 1.5s

    return () => clearTimeout(timer);
  }, []);

  // ✅ Terminer quand toutes les conditions sont remplies
  useEffect(() => {
    if (animationFinished && minimumTimeReached && isDataReady) {
      // ✅ Délai supplémentaire si les données sont prêtes trop rapidement
      const extraDelay = progress >= 100 ? 500 : 0;
      setTimeout(appReadyHandler, extraDelay);
    }
  }, [
    animationFinished,
    minimumTimeReached,
    isDataReady,
    appReadyHandler,
    progress,
  ]);

  const handleAnimationFinish = () => {
    setAnimationFinished(true);
  };

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop={false}
        speed={1} // ✅ Vitesse normale pour laisser voir l'animation
        source={require("../../assets/splash/animation.json")}
        style={styles.animation}
        onAnimationFinish={handleAnimationFinish}
      />

      {/* ✅ Affichage conditionnel du progress */}
      {progress > 0 && (
        <View style={styles.textContainer}>
          <Text style={styles.loadingText}>{currentStep}</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: colors.BLUE,
                },
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    position: "absolute",
    bottom: 80, // ✅ Plus d'espace depuis le bas
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.DARK,
    marginBottom: 16, // ✅ Plus d'espace
    textAlign: "center",
  },
  progressBarContainer: {
    width: 200, // ✅ Largeur fixe plus grande
    height: 4, // ✅ Plus fin et élégant
    borderRadius: 2,
    backgroundColor: colors.GREY,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
    // ✅ Transition CSS pour une animation fluide
  },
  progressPercentage: {
    fontSize: 12,
    color: colors.GREY,
    fontWeight: "500",
  },
});
