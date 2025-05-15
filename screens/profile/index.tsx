import { View, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "@constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/api/userApi";
import ProfileForm from "@screens/profile/components/ProfileForm";
import { FormikValues } from "formik";

export default function Profile() {
  const { userId, token } = useSelector((state: RootState) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery(
    { userId: userId!, token: token! },
    { skip: !userId || !token },
  );
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const updateUserProfile = (values: FormikValues) => {
    updateUser({
      userId,
      token,
      ...values,
    });
  };

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.DARK} />
      </View>
    );
  }

  return (
    <ProfileForm
      user={user}
      isLoading={isUpdating}
      submitFormHandler={updateUserProfile}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.LIGHT,
    alignItems: "center",
  },
});
