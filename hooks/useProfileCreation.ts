import { useEffect } from "react";
import { useAuth } from "./queries/useAuth";
import { useUserById, useCreateUserProfile } from "./queries/useUser";
import { CreateUserRequest } from "@services/userService";
import { adaptAppwriteUserForForm } from "@models/user";
import { ProfileFormUser } from "@models/profile";

/**
 * Hook to manage automatic user profile creation
 * after registration
 */
export const useProfileCreation = () => {
  const { user: authUser, isAuthenticated } = useAuth();

  const {
    data: appwriteUserProfile,
    isLoading: isCheckingProfile,
    error: profileError,
  } = useUserById(authUser?.$id || "", {
    enabled: !!authUser?.$id && isAuthenticated,
  });

  const createUserProfileMutation = useCreateUserProfile();

  /**
   * Function exported to create a profile explicitly
   * Useful for registration where we want to force immediate creation
   */
  const createUserProfileExplicitly = async (
    userId: string,
    email: string,
    name?: string,
  ) => {
    try {
      console.log("🆕 Création explicite du profil utilisateur...");

      // Prepare the payload with only the required fields
      const userProfileData: CreateUserRequest = {
        userId,
        email,
      };

      // Add a default username only if available
      if (name) {
        userProfileData.fullName = name;
      } else if (email) {
        // Fallback to use the local part of the email
        userProfileData.fullName = email.split("@")[0];
      }

      // Add a default empty location object
      userProfileData.location = {
        postalCode: "",
        street: "",
        city: "",
      };

      const result =
        await createUserProfileMutation.mutateAsync(userProfileData);
      console.log("✅ Profil créé explicitement");
      return result;
    } catch (error) {
      console.error("❌ Erreur lors de la création du profil:", error);
      throw error;
    }
  };

  // Create the profile automatically if it doesn't exist
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      // ✅ Vérifier si l'erreur indique que le profil n'existe pas
      const isProfileNotFound = profileError?.message?.includes(
        "User profile not found",
      );

      const shouldCreateProfile =
        isAuthenticated &&
        authUser &&
        !isCheckingProfile &&
        !appwriteUserProfile &&
        isProfileNotFound &&
        !createUserProfileMutation.isPending;

      if (shouldCreateProfile) {
        try {
          console.log("🆕 Création automatique du profil utilisateur...");

          // Prepare the payload with only the required fields
          const userProfileData: CreateUserRequest = {
            userId: authUser.$id,
            email: authUser.email,
          };

          // Add a default username only if available
          if (authUser.name) {
            userProfileData.fullName = authUser.name;
          } else if (authUser.email) {
            // Fallback to use the local part of the email
            userProfileData.fullName = authUser.email.split("@")[0];
          }

          // Add a default empty location object
          userProfileData.location = {
            postalCode: "",
            street: "",
            city: "",
          };

          await createUserProfileMutation.mutateAsync(userProfileData);

          console.log("✅ Profil créé automatiquement");
        } catch (error) {
          console.error("❌ Erreur lors de la création du profil:", error);
        }
      }
    };

    createProfileIfNeeded();
  }, [
    isAuthenticated,
    authUser,
    isCheckingProfile,
    appwriteUserProfile,
    profileError,
    createUserProfileMutation,
  ]);

  // Determine if we have a real error (not a "profile not found" error)
  const hasRealError =
    profileError && !profileError.message?.includes("User profile not found");

  const userProfile: ProfileFormUser | null = appwriteUserProfile
    ? adaptAppwriteUserForForm(appwriteUserProfile)
    : null;

  return {
    userProfile, // Profile adapted for ProfileForm
    appwriteUserProfile, // Profile Appwrite original
    isLoadingProfile: isCheckingProfile || createUserProfileMutation.isPending,
    profileError: hasRealError ? profileError : null,
    createUserProfileExplicitly, // Function to create a profile explicitly
  };
};
