import AuthForm from "@screens/auth/components/AuthForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSignMutation } from "../../store/api/authApi";
import { setToken, setUserId } from "../../store/slices/authSlice";
import { AuthFormValues } from "@models/auth";
import { useCreateUserMutation } from "../../store/api/userApi";

type SignupProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

export default function Signup({ navigation }: SignupProps) {
  const dispatch = useDispatch();
  const [signUp, { data, isLoading, error }] = useSignMutation();
  const [createUser, { data: user, isLoading: isCreating }] =
    useCreateUserMutation();

  const navigateToLogin = () => {
    navigation.replace("Login");
  };

  const submitFormHandler = async (values: AuthFormValues) => {
    const response = await signUp({
      email: values.email,
      password: values.password,
      endpoint: "signUp",
    });
    if (!response.error) {
      createUser({
        user: { email: values.email },
        token: response.data.idToken,
        id: response.data.localId,
      });
    }
  };

  useEffect(() => {
    if (data?.idToken && user) {
      dispatch(setToken(data.idToken));
      dispatch(setUserId(data.localId));
    }
  }, [data, user, dispatch]);

  return (
    <AuthForm
      navigate={navigateToLogin}
      submitFormHandler={submitFormHandler}
      isLoading={isLoading || isCreating}
      error={error}
    />
  );
}
