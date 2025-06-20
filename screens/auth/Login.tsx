import React from "react";
import { View, StyleSheet } from "react-native";
import AuthForm from "./components/AuthForm";
import { useSignIn } from "@hooks/queries/useAuth";
import { LoginRequest } from "@services/authService";

type LoginProps = {
  navigation: any; // ou le type approprié
};

export default function Login({ navigation }: LoginProps) {
  const signInMutation = useSignIn();

  const submitFormHandler = (values: LoginRequest) => {
    signInMutation.mutate(values);
  };

  const navigate = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <AuthForm
        loginScreen={true}
        navigate={navigate}
        submitFormHandler={submitFormHandler}
        isLoading={signInMutation.isPending}
        error={signInMutation.error?.message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
