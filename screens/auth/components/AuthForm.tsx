import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import * as Yup from "yup";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import Input from "@ui-components/inputs/Input";
import { Formik, FormikHelpers } from "formik";
import CustomButton from "@ui-components/buttons/CustomButton";
import TextMediumM from "@ui-components/texts/TextMediumM";
import TextBoldM from "@ui-components/texts/TextBoldM";

type BaseFormValues = {
  email: string;
  password: string;
};

type AuthFormValues = BaseFormValues &
  Partial<{
    confirmPassword: string;
  }>;

type AuthFormProps = {
  loginScreen?: boolean;
  navigate: () => void;
  submitFormHandler: (
    values: AuthFormValues,
    formikHelpers: FormikHelpers<AuthFormValues>,
  ) => void | Promise<void>;
  isLoading?: boolean;
  error: any;
};

export default function AuthForm({
  loginScreen,
  navigate,
  submitFormHandler,
  isLoading,
}: AuthFormProps) {
  const initialValues = loginScreen
    ? { email: "", password: "" }
    : {
        email: "",
        password: "",
        confirmPassword: "",
      };

  const confirmPasswordRule = !loginScreen
    ? {
        confirmPassword: Yup.string()
          .oneOf(
            [Yup.ref("password")],
            "Les mots de passe ne correspondent pas",
          )
          .required("Le mot de passe est obligatoire"),
      }
    : {};

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("L'email est incorrect")
      .required("L'email est obligatoire"),
    password: Yup.string()
      .min(6, "Le mot de passe doit faire au moins 6 caractères")
      .required("Le mot de passe est obligatoire"),
    ...confirmPasswordRule,
  } as Record<string, Yup.StringSchema>);

  const testAppwriteDirectly = async () => {
    console.log("🔍 Test Appwrite direct...");
    try {
      const { testConnection } = require("../../../appwrite");
      const result = await testConnection();

      if (result) {
        console.log("✅ Appwrite fonctionne !");
        Alert.alert("✅ Succès", "Appwrite fonctionne parfaitement !");
      } else {
        console.log("❌ Problème avec Appwrite");
        Alert.alert("❌ Erreur", "Problème de connexion avec Appwrite");
      }
    } catch (error: any) {
      console.error("❌ Erreur test Appwrite:", error);
      Alert.alert(
        "❌ Erreur",
        `Erreur: ${error?.message || "Erreur inconnue"}`,
      );
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* ✅ Bouton Debug Appwrite - seulement en mode DEV et sur l'écran de login */}
      {__DEV__ && loginScreen && (
        <View style={styles.debugContainer}>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={testAppwriteDirectly}
            activeOpacity={0.7}
          >
            <Text style={styles.debugText}>🔧 Test Appwrite</Text>
          </TouchableOpacity>
          <Text style={styles.devModeText}>Mode développement</Text>
        </View>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={submitFormHandler}
        validationSchema={validationSchema}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          handleBlur,
        }) => (
          <>
            <Input
              label="Email"
              maxLength={60}
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={!!errors.email && touched.email}
              errorText={errors.email}
              autoCapitalize="none"
            />
            <Input
              label="Mot de passe"
              maxLength={60}
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              error={!!errors.password && touched.password}
              errorText={errors.password}
              autoCapitalize="none"
              type="password"
            />
            {!loginScreen ? (
              <Input
                label="Confirmation du mot de passe"
                maxLength={60}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={!!errors.confirmPassword && touched.confirmPassword}
                errorText={errors.confirmPassword}
                autoCapitalize="none"
                type="password"
              />
            ) : null}
            <CustomButton
              text="Valider"
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </>
        )}
      </Formik>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={navigate}
        style={styles.switchAuthContainer}
      >
        <TextMediumM>
          {loginScreen
            ? "Vous n'avez pas encore de compte ? "
            : "Vous avez déjà un compte ? "}
        </TextMediumM>
        <TextBoldM>
          {loginScreen ? "Inscrivez vous" : "Connectez-vous"}
        </TextBoldM>
      </TouchableOpacity>

      {/* ✅ Alternative : Bouton discret en bas - seulement sur login */}
      {__DEV__ && loginScreen && (
        <TouchableOpacity
          style={styles.debugButtonBottom}
          onPress={testAppwriteDirectly}
          activeOpacity={0.7}
        >
          <Text style={styles.debugTextBottom}>🏓 Ping Appwrite</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: spaces.L,
    backgroundColor: colors.LIGHT,
    justifyContent: "center",
  },
  switchAuthContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spaces.XL,
  },
  // ✅ Styles pour les boutons debug
  debugContainer: {
    position: "absolute",
    top: 60,
    left: spaces.L,
    right: spaces.L,
    backgroundColor: "rgba(255, 107, 107, 0.9)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 1000,
    elevation: 5,
  },
  debugButton: {
    backgroundColor: colors.DARK,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  debugText: {
    color: colors.LIGHT,
    fontWeight: "bold",
    fontSize: 14,
  },
  devModeText: {
    color: colors.LIGHT,
    fontSize: 12,
    fontWeight: "600",
  },
  debugButtonBottom: {
    position: "absolute",
    bottom: 30,
    left: spaces.L,
    right: spaces.L,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  debugTextBottom: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
