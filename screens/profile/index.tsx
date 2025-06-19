import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { colors } from "@constants/colors";
import {
  useUpdateUserProfileMutation,
  useUploadUserPictureMutation,
} from "@store/api/userApi";
import { useAuth } from "@store/api/authApi";
import { useProfileCreation } from "@hooks/useProfileCreation";
import ProfileForm from "@screens/profile/components/ProfileForm";
import { FormikValues } from "formik";
import { useEffect, useState } from "react";
import { ProfileImage } from "@models/profile";

export default function Profile() {
  const [image, setImage] = useState<ProfileImage>({
    uri: undefined,
    new: false,
  });

  // Use the useAuth hook to retrieve the logged-in user
  const { user: authUser } = useAuth();

  // Use the custom hook for profile management
  const { userProfile, appwriteUserProfile, isLoadingProfile, profileError } =
    useProfileCreation();

  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadUserPictureMutation();

  const updateUserProfileHandler = async (values: FormikValues) => {
    if (!appwriteUserProfile || !authUser) {
      console.error("❌ Pas de profil utilisateur ou d'authentification");
      return;
    }

    try {
      let imageUrl = appwriteUserProfile.photoUrl;

      // Upload the new image if necessary
      if (image.new && image.uri) {
        console.log("📸 Upload de la nouvelle image...");
        const imageResult = await uploadImage({
          uri: image.uri,
          userId: authUser.$id,
          previousPhotoUrl: appwriteUserProfile.photoUrl, // Passage of the old URL for deletion
        }).unwrap();

        if (imageResult?.url) {
          imageUrl = imageResult.url;
          console.log("✅ Image uploadée:", imageUrl);
        }
      }

      // Profile update
      console.log("📝 Updating profile...");
      await updateUserProfile({
        documentId: appwriteUserProfile.$id,
        userId: authUser.$id,
        fullName: values.fullName,
        photoUrl: imageUrl,
        location: {
          postalCode: values.location?.postalCode,
          street: values.location?.street,
          city: values.location?.city,
        },
      }).unwrap();

      console.log("✅ Profil mis à jour avec succès");

      // Reset image status
      setImage((prev) => ({ ...prev, new: false }));
    } catch (error: any) {
      console.error("❌ Erreur lors de la mise à jour du profil:", error);
    }
  };

  // Initialize profile image
  useEffect(() => {
    if (appwriteUserProfile?.photoUrl) {
      setImage({ uri: appwriteUserProfile.photoUrl, new: false });
    }
  }, [appwriteUserProfile]);

  // Loading display
  if (isLoadingProfile || !authUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.DARK} />
        {/* <Text style={styles.loadingText}>Chargement du profil...</Text> */}
      </View>
    );
  }

  // Error handling (except 404, which is handled automatically)
  if (profileError) {
    console.error("❌ Erreur de chargement du profil:", profileError);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Erreur lors du chargement du profil
        </Text>
        <ActivityIndicator size="large" color={colors.DARK} />
      </View>
    );
  }

  // If the profile does not yet exist (currently being created)
  if (!userProfile || !appwriteUserProfile) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.DARK} />
        <Text style={styles.loadingText}>Création du profil...</Text>
      </View>
    );
  }

  return (
    <ProfileForm
      user={userProfile}
      isLoading={isUpdating || isUploading}
      submitFormHandler={updateUserProfileHandler}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.DARK,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
