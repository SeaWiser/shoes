import { Alert } from "react-native";
import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useEffect } from "react";
import { useSignInMutation } from "@store/api/authApi";
import { FormikHelpers } from "formik";

type LoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function Login({ navigation }: LoginProps) {
  const [signIn, { data, isLoading, error }] = useSignInMutation();

  const navigateToSignup = () => {
    navigation.replace("Signup");
  };

  const submitFormHandler = async (
    values: AuthFormValues,
    formikHelpers: FormikHelpers<AuthFormValues>,
  ) => {
    try {
      await signIn({
        email: values.email,
        password: values.password,
      }).unwrap();
    } catch (error: any) {
      console.error("Erreur de connexion:", error);

      Alert.alert(
        "Erreur de connexion",
        error?.data || "Une erreur est survenue lors de la connexion",
      );

      formikHelpers.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data?.user) {
      console.log("✅ Connexion réussie:", data.user.email);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("❌ Erreur auth:", error);
    }
  }, [error]);

  return (
    <AuthForm
      loginScreen
      navigate={navigateToSignup}
      submitFormHandler={submitFormHandler}
      isLoading={isLoading}
      error={error}
    />
  );
}
