import { View, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "@constants/colors";
import { useAuthStore } from "../../store/authStore";
import {
  useUserById,
  useUpdateUserProfile,
  useUploadUserPicture,
} from "@hooks/queries/useUser";
import ProfileForm from "@screens/profile/components/ProfileForm";
import { FormikValues } from "formik";
import { useEffect, useState } from "react";
import { ProfileImage } from "@models/profile";
import { adaptAppwriteUserForForm } from "@models/user";

export default function Profile() {
  const { user: authUser } = useAuthStore();
  const { data: user, isLoading } = useUserById(authUser?.$id!);
  const updateUserMutation = useUpdateUserProfile();
  const uploadPictureMutation = useUploadUserPicture();
  const [image, setImage] = useState<ProfileImage>({
    uri: undefined,
    new: false,
  });

  const updateUserProfile = async (values: FormikValues) => {
    if (!user?.$id || !authUser?.$id) return;

    try {
      let photoUrl = user.photoUrl;

      // Upload new image if provided
      if (image.new && image.uri) {
        const uploadResult = await uploadPictureMutation.mutateAsync({
          uri: image.uri,
          userId: authUser.$id,
          previousPhotoUrl: user.photoUrl,
        });
        photoUrl = uploadResult.url;
      }

      // Update user profile
      await updateUserMutation.mutateAsync({
        documentId: user.$id,
        userId: authUser.$id,
        fullName: values.fullName,
        photoUrl,
        location: {
          street: values.location?.street || "",
          city: values.location?.city || "",
          postalCode: values.location?.postalCode || "",
        },
      });
    } catch (error) {
      console.error("❌ Erreur mise à jour profil:", error);
    }
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

  // Using the utility function
  const profileFormUser = adaptAppwriteUserForForm(user);

  return (
    <ProfileForm
      user={profileFormUser}
      isLoading={
        updateUserMutation.isPending || uploadPictureMutation.isPending
      }
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
