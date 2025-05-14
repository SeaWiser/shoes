import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSignMutation } from "../../store/api/authApi";
import { setToken } from "../../store/slices/authSlice";
import { AuthFormValues } from "@models/auth";
// import { useCreateUserMutation } from "../../store/api/userApi";

type SignupProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

export default function Signup({ navigation }: SignupProps) {
  const dispatch = useDispatch();
  const [signUp, { data, isLoading, error }] = useSignMutation();
  // const [createUser, { data, isLoading, isSuccess }] = useCreateUserMutation();

  const navigateToLogin = () => {
    navigation.replace("Login");
  };

  const submitFormHandler = (values: AuthFormValues) => {
    signUp({
      email: values.email,
      password: values.password,
      endpoint: "signUp",
    });
    // createUser({email: values.email, password: values.password});
  };

  useEffect(() => {
    if (data) {
      dispatch(setToken(data.idToken));
      // dispatch(setUserId(data?.id));
    }
  }, [data]);

  return (
    <AuthForm
      navigate={navigateToLogin}
      submitFormHandler={submitFormHandler}
      isLoading={isLoading}
      error={error}
    />
  );
}
