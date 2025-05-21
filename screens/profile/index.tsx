import { View, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "@constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUploadUserPictureMutation,
} from "../../store/api/userApi";
import ProfileForm from "@screens/profile/components/ProfileForm";
import { FormikValues } from "formik";
import { useEffect, useState } from "react";
import { ProfileImage } from "@models/profile";

export default function Profile() {
  const [image, setImage] = useState<ProfileImage>({
    uri: undefined,
    new: false,
  });
  const { userId, token } = useSelector((state: RootState) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery(
    { userId: userId!, token: token! },
    { skip: !userId || !token },
  );
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadUserPictureMutation();

  const updateUserProfile = async (values: FormikValues) => {
    let imageResult;
    if (image.new) {
      imageResult = await uploadImage({ uri: image.uri, userId });
    }
    updateUser({
      userId,
      token,
      photoUrl: imageResult?.data ? imageResult.data : user?.photoUrl,
      ...values,
    });
  };

  useEffect(() => {
    if (user?.photoUrl) {
      setImage({ uri: user.photoUrl, new: false });
    }
  }, [user]);

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
      isLoading={isUpdating || isUploading}
      submitFormHandler={updateUserProfile}
      image={image}
      setImage={setImage}
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
