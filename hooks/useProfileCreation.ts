import { useEffect } from "react";
import { useAuth } from "@store/api/authApi";
import {
  useGetUserByIdQuery,
  useCreateUserProfileMutation,
  CreateUserRequest,
} from "@store/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  AppwriteUser,
  adaptAppwriteUserForForm,
  ProfileFormUser,
} from "@models/user";

/**
 * Type guard to check if the error is a FetchBaseQueryError
 */
const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
  return error && typeof error === "object" && "status" in error;
};

/**
 * Utility function to extract the status from an RTK Query error
 */
const getErrorStatus = (error: any): number | undefined => {
  if (isFetchBaseQueryError(error)) {
    return typeof error.status === "number" ? error.status : undefined;
  }
  return undefined;
};

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
  } = useGetUserByIdQuery(authUser?.$id || "", {
    skip: !authUser?.$id || !isAuthenticated,
  });

  const [createUserProfile, { isLoading: isCreatingProfile }] =
    useCreateUserProfileMutation();

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

      const result = await createUserProfile(userProfileData).unwrap();
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
      const shouldCreateProfile =
        isAuthenticated &&
        authUser &&
        !isCheckingProfile &&
        !appwriteUserProfile &&
        profileError &&
        getErrorStatus(profileError) === 404;

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

          await createUserProfile(userProfileData).unwrap();

          console.log("✅ Automatically created profile");
        } catch (error) {
          console.error("❌ Error while creating profile:", error);
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
    createUserProfile,
  ]);

  // Determine if we have a real error (not a 404 indicating the profile simply doesn't exist)
  const hasRealError = profileError && getErrorStatus(profileError) !== 404;

  const userProfile: ProfileFormUser | null = appwriteUserProfile
    ? adaptAppwriteUserForForm(appwriteUserProfile)
    : null;

  return {
    userProfile, // Profile adapted for ProfileForm
    appwriteUserProfile, // Profile Appwrite original
    isLoadingProfile: isCheckingProfile || isCreatingProfile,
    profileError: hasRealError ? profileError : null,
    createUserProfileExplicitly, // Function to create a profile explicitly
  };
};
