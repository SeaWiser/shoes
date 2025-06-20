import React from "react";
import { Alert } from "react-native";
import { FormikHelpers } from "formik";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AuthForm from "@screens/auth/components/AuthForm";
import { RootStackParamList } from "@models/navigation";
import { useSignUp } from "@hooks/queries/useAuth";
import { useCreateUserProfile } from "@hooks/queries/useUser";
import { SignupRequest } from "@services/authService";

type SignupProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function Signup({ navigation }: SignupProps) {
  const signUpMutation = useSignUp();
  const createUserProfileMutation = useCreateUserProfile();

  const navigateToLogin = () => {
    navigation.replace("Login");
  };

  const submitFormHandler = async (
    values: AuthFormValues,
    formikHelpers: FormikHelpers<AuthFormValues>,
  ) => {
    try {
      // 1. Créer le compte d'authentification
      const response = await signUpMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      console.log("✅ Inscription réussie:", response.user.email);

      // 2. Créer le profil utilisateur dans la collection
      try {
        await createUserProfileMutation.mutateAsync({
          userId: response.user.$id,
          email: response.user.email,
          fullName: response.user.name || "",
        });

        Alert.alert(
          "Inscription réussie",
          "Votre compte a été créé avec succès.",
          [{ text: "OK" }],
        );
      } catch (profileError: any) {
        console.error("❌ Erreur création profil:", profileError);
        Alert.alert(
          "Erreur",
          "Le compte a été créé mais une erreur est survenue lors de la configuration du profil.",
          [{ text: "OK" }],
        );
      }
    } catch (error: any) {
      console.error("❌ Erreur inscription:", error);

      if (error.message.includes("account already exists")) {
        Alert.alert(
          "Compte existant",
          "Un compte existe déjà avec cet email. Voulez-vous vous connecter ?",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Se connecter", onPress: navigateToLogin },
          ],
        );
      }
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <AuthForm
      navigate={navigateToLogin}
      submitFormHandler={submitFormHandler}
      isLoading={
        signUpMutation.isPending || createUserProfileMutation.isPending
      }
      error={
        signUpMutation.error?.message ||
        createUserProfileMutation.error?.message
      }
    />
  );
}
