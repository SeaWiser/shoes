import { StyleSheet } from "react-native";
import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useCreateUserMutation } from "../../store/api/userApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserId } from "../../store/slices/userSlice";

type SignupProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

export default function Signup({ navigation }: SignupProps) {
  const dispatch = useDispatch();
  const [createUser, { data, isLoading, isSuccess }] = useCreateUserMutation();
  const navigateToLogin = () => {
    navigation.replace("Login");
  };

  const submitFormHandler = (values: { email: string }) => {
    createUser({ email: values.email });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserId(data?.id));
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
