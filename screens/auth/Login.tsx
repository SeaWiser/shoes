import { StyleSheet } from "react-native";
import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";

type LoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function Login({ navigation }: LoginProps) {
  const navigateToSignup = () => {
    navigation.replace("Signup");
  };
  return <AuthForm loginScreen navigate={navigateToSignup} />;
}

const styles = StyleSheet.create({});
