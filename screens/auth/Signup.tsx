import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useSignUpMutation } from "@store/api/authApi";
import { AuthFormValues } from "@models/auth";
import { Alert } from "react-native";
import { FormikHelpers } from "formik";
import { useProfileCreation } from "@hooks/useProfileCreation";
import { account } from "../../appwrite";

type SignupProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

export default function Signup({ navigation }: SignupProps) {
  const [signUp, { isLoading, error }] = useSignUpMutation();
  const { createUserProfileExplicitly } = useProfileCreation();

  const navigateToLogin = () => {
    navigation.replace("Login");
  };

  const submitFormHandler = async (
    values: AuthFormValues,
    formikHelpers: FormikHelpers<AuthFormValues>,
  ) => {
    try {
      // 1. Création du compte d'authentification
      const response = await signUp({
        email: values.email,
        password: values.password,
      }).unwrap();

      console.log("✅ Inscription réussie:", response.user.email);

      // 2. Création du profil utilisateur dans la collection
      try {
        // Utiliser la fonction centralisée du hook
        await createUserProfileExplicitly(
          response.user.$id,
          response.user.email,
          response.user.name,
        );

        // Ne pas naviguer - laisser la redirection automatique
        // via la logique conditionnelle du MainStackNavigator
        Alert.alert(
          "Inscription réussie",
          "Votre compte a été créé avec succès.",
          [{ text: "OK" }],
        );
      } catch (profileError: any) {
        console.error("❌ Erreur création profil:", profileError);
        Alert.alert(
          "Erreur de création de profil",
          "Votre compte a été créé mais nous n'avons pas pu initialiser votre profil. Veuillez vous connecter pour compléter votre profil.",
        );
        // Déconnexion pour revenir à l'écran de login
        await account.deleteSession("current");
      }
    } catch (error: any) {
      console.error("❌ Erreur inscription:", error);

      if (error.status === 409) {
        Alert.alert(
          "Compte existant",
          "Un compte existe déjà avec cet email. Voulez-vous vous connecter ?",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Se connecter", onPress: navigateToLogin },
          ],
        );
      } else {
        Alert.alert(
          "Erreur d'inscription",
          error.data || "Une erreur est survenue lors de l'inscription",
        );
      }

      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <AuthForm
      navigate={navigateToLogin}
      submitFormHandler={submitFormHandler}
      isLoading={isLoading}
      error={error}
    />
  );
}
