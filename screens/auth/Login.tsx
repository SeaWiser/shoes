import { StyleSheet } from "react-native";
import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useLazyGetUserQuery } from "../../store/api/userApi";
import { useEffect } from "react";

type LoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function Login({ navigation }: LoginProps) {
  const [getUser, { data, isFetching }] = useLazyGetUserQuery();
  const navigateToSignup = () => {
    navigation.replace("Signup");
  };
  const submitFormHandler = (values: { email: string }) => {
    getUser({ email: values.email });
  };

  useEffect(() => {
    if (data?.id) {
      navigation.replace("Drawer");
    }
  }, [data]);

  return (
    <AuthForm
      loginScreen
      navigate={navigateToSignup}
      submitFormHandler={submitFormHandler}
      isLoading={isFetching}
    />
  );
}

const styles = StyleSheet.create({});
