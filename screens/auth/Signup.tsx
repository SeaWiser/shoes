import { StyleSheet } from "react-native";
import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useCreateUserMutation } from "../../store/api/userApi";
import { useEffect } from "react";

type SignupProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

export default function Signup({ navigation }: SignupProps) {
  const [createUser, { isLoading, isSuccess }] = useCreateUserMutation();
  const navigateToLogin = () => {
    navigation.replace("Login");
  };

  const submitFormHandler = (values: { email: string }) => {
    createUser({ email: values.email });
  };

  useEffect(() => {
    if (isSuccess) {
      navigation.replace("Drawer");
    }
  }, [isSuccess]);

  return (
    <AuthForm
      navigate={navigateToLogin}
      submitFormHandler={submitFormHandler}
      isLoading={isLoading}
    />
  );
}

const styles = StyleSheet.create({});
