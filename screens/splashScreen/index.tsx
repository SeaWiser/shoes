import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { colors } from "@constants/colors";

interface SplashScreenProps {
  appReadyHandler: () => void;
}

export default function SplashScreen({ appReadyHandler }: SplashScreenProps) {
  return (
    <LottieView
      autoPlay
      loop={false}
      speed={0.5}
      source={require("../../assets/splash/animation.json")}
      style={styles.animation}
      onAnimationFinish={appReadyHandler}
    />
  );
}

const styles = StyleSheet.create({
  animation: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.LIGHT,
  },
});
