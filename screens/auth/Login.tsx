import { StyleSheet } from "react-native";
import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSignMutation } from "../../store/api/authApi";
import { AuthFormValues } from "@models/auth";
import { setToken, setUserId } from "../../store/slices/authSlice";

type LoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function Login({ navigation }: LoginProps) {
  const dispatch = useDispatch();
  const [signIn, { data, isLoading, error }] = useSignMutation();

  const navigateToSignup = () => {
    navigation.replace("Signup");
  };

  const submitFormHandler = (values: AuthFormValues) => {
    signIn({
      email: values.email,
      password: values.password,
      endpoint: "signInWithPassword",
    });
  };

  useEffect(() => {
    if (data) {
      dispatch(setToken(data.idToken));
      dispatch(setUserId(data.localId));
    }
  }, [data]);

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

const styles = StyleSheet.create({});
