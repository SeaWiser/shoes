import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AppwriteUser, UserLocation } from "@models/user";
import { databases, ID, storage } from "../../appwrite";
import { Query } from "react-native-appwrite";
import { Cart } from "@models/cart";

export interface CreateUserRequest {
  userId: string;
  email: string;
  fullName?: string;
  location?: UserLocation;
}

export interface UpdateUserRequest {
  userId: string;
  fullName?: string;
  photoUrl?: string;
  location?: UserLocation;
  favoriteIds?: string[];
  cart?: Cart;
  seenNotifsIds?: string[]; // Ajout de cette ligne
}

export interface UploadImageRequest {
  uri: string;
  userId: string;
}

// Database configuration
const DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "your-database-id";
const USER_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || "users";
const STORAGE_BUCKET_ID =
  process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "user-images";

const ErrorMessages: Record<number, string> = {
  400: "Invalid data",
  401: "Not allowed",
  404: "User not found",
  409: "The user already exists",
  500: "Server error, please try again",
};

const formatError = (error: any) => {
  return {
    status: error.code || 500,
    data: ErrorMessages[error.code] || error.message || "An error has occurred",
  };
};

const serializeLocation = (location?: UserLocation): string => {
  if (!location) {
    return JSON.stringify({
      postalCode: "",
      street: "",
      city: "",
    });
  }
  return JSON.stringify(location);
};

const deserializeLocation = (locationString?: string): UserLocation | null => {
  if (!locationString) return null;
  try {
    return JSON.parse(locationString);
  } catch {
    return null;
  }
};

// Fonctions de sérialisation pour le panier
const serializeCart = (cart?: Cart): string => {
  if (!cart) {
    return JSON.stringify({ shoes: [], totalAmount: 0 });
  }
  return JSON.stringify(cart);
};

const deserializeCart = (cartString?: string): Cart | null => {
  if (!cartString) return null;
  try {
    return JSON.parse(cartString);
  } catch {
    return null;
  }
};

const extractFileIdFromUrl = (photoUrl?: string): string | null => {
  if (!photoUrl) return null;

  try {
    const match = photoUrl.match(/\/files\/([^\/]+)\/view/);
    return match ? match[1] : null;
  } catch (error) {
    console.error(
      "[AppwriteUserApi] Error extracting file ID from URL:",
      error,
    );
    return null;
  }
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Create a user profile after registration
    createUserProfile: builder.mutation<AppwriteUser, CreateUserRequest>({
      queryFn: async ({ userId, email, fullName, location }) => {
        try {
          console.log(
            `[AppwriteUserApi] Creating user profile for userId: ${userId}`,
          );

          const userData = {
            userId,
            email,
            fullName: fullName || "",
            favoriteIds: [], // Initialiser avec un tableau vide
            cart: serializeCart(undefined), // Initialiser avec un panier vide
            seenNotifsIds: [], // Ajout de cette ligne
          };

          console.log(
            "User data to be sent:",
            JSON.stringify(userData, null, 2),
          );

          const response = await databases.createDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            ID.unique(),
            userData,
          );

          console.log(
            `[AppwriteUserApi] User profile created successfully: ${response.$id}`,
          );

          // Deserialize cart in response
          const userWithParsedData = {
            ...response,
            cart: deserializeCart(response.cart as string),
          };

          return { data: userWithParsedData as unknown as AppwriteUser };
        } catch (error: any) {
          console.error(
            `[AppwriteUserApi] Error creating user profile:`,
            error,
          );
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["User"],
    }),

    // Retrieve a user by their user ID (Auth)
    getUserById: builder.query<AppwriteUser, string>({
      queryFn: async (userId) => {
        try {
          console.log(
            `[AppwriteUserApi] Fetching user profile for userId: ${userId}`,
          );

          const response = await databases.listDocuments(
            DATABASE_ID,
            USER_COLLECTION_ID,
            [Query.equal("userId", userId)],
          );

          if (response.documents.length === 0) {
            return {
              error: { status: 404, data: "User profile not found" },
            };
          }

          const user = response.documents[0];

          // Deserialize location and cart
          const userWithParsedData = {
            ...user,
            location:
              typeof user.location === "string"
                ? deserializeLocation(user.location)
                : user.location,
            cart:
              typeof user.cart === "string"
                ? deserializeCart(user.cart)
                : user.cart,
          };

          console.log(
            `[AppwriteUserApi] User profile retrieved: ${user.email}`,
          );
          return { data: userWithParsedData as unknown as AppwriteUser };
        } catch (error: any) {
          console.error(
            `[AppwriteUserApi] Error fetching user profile:`,
            error,
          );
          return { error: formatError(error) };
        }
      },
      providesTags: (result) =>
        result ? [{ type: "User", id: result.$id }] : [],
    }),

    // Update user profile avec optimistic updates
    updateUserProfile: builder.mutation<
      AppwriteUser,
      UpdateUserRequest & { documentId: string }
    >({
      queryFn: async ({
        documentId,
        userId,
        fullName,
        photoUrl,
        location,
        favoriteIds,
        cart,
        seenNotifsIds, // Ajout de cette ligne
      }) => {
        try {
          console.log(`[AppwriteUserApi] Updating user profile: ${documentId}`);

          const updateData: Record<string, any> = {};
          if (fullName !== undefined) updateData.fullName = fullName;
          if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
          if (location !== undefined) {
            updateData.location = serializeLocation(location);
          }
          if (favoriteIds !== undefined) {
            updateData.favoriteIds = favoriteIds;
          }
          if (cart !== undefined) {
            updateData.cart = serializeCart(cart);
          }
          if (seenNotifsIds !== undefined) {
            updateData.seenNotifsIds = seenNotifsIds;
          }

          const response = await databases.updateDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            documentId,
            updateData,
          );

          // Deserialize data in response
          const userWithParsedData = {
            ...response,
            location: deserializeLocation(response.location as string),
            cart: deserializeCart(response.cart as string),
          };

          console.log(`[AppwriteUserApi] User profile updated successfully`);
          return { data: userWithParsedData as unknown as AppwriteUser };
        } catch (error: any) {
          console.error(
            `[AppwriteUserApi] Error updating user profile:`,
            error,
          );
          return { error: formatError(error) };
        }
      },
      // Optimistic update de RTK Query
      async onQueryStarted(
        {
          documentId,
          userId,
          fullName,
          photoUrl,
          location,
          favoriteIds,
          cart,
          seenNotifsIds,
        },
        { dispatch, queryFulfilled },
      ) {
        // Mise à jour optimiste
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUserById", userId, (draft) => {
            if (fullName !== undefined) draft.fullName = fullName;
            if (photoUrl !== undefined) draft.photoUrl = photoUrl;
            if (location !== undefined) draft.location = location;
            if (favoriteIds !== undefined) draft.favoriteIds = favoriteIds;
            if (cart !== undefined) draft.cart = cart;
            if (seenNotifsIds !== undefined)
              draft.seenNotifsIds = seenNotifsIds; // Ajout de cette ligne
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert en cas d'erreur
          patchResult.undo();
        }
      },
      invalidatesTags: (result) =>
        result ? [{ type: "User", id: result.$id }] : [],
    }),

    // Toggle favorite
    toggleFavorite: builder.mutation<
      AppwriteUser,
      { userId: string; documentId: string; shoeId: string }
    >({
      queryFn: async ({ userId, documentId, shoeId }) => {
        console.log("init favorite");
        try {
          console.log(
            `[AppwriteUserApi] Toggling favorite for shoe: ${shoeId}`,
          );

          // First, get current user data
          const currentUser = await databases.getDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            documentId,
          );

          console.log(
            `[AppwriteUserApi] Current user data:`,
            JSON.stringify(currentUser, null, 2),
          );

          // Vérifier le type de favoriteIds
          console.log(
            `[AppwriteUserApi] favoriteIds type:`,
            typeof currentUser.favoriteIds,
            Array.isArray(currentUser.favoriteIds),
          );

          // Initialiser correctement favoriteIds
          const currentFavorites = Array.isArray(currentUser.favoriteIds)
            ? currentUser.favoriteIds
            : [];

          console.log(
            `[AppwriteUserApi] Current favorites:`,
            JSON.stringify(currentFavorites, null, 2),
          );

          let newFavorites: string[];

          if (currentFavorites.includes(shoeId)) {
            // Remove from favorites
            newFavorites = currentFavorites.filter(
              (id: string) => id !== shoeId,
            );
            console.log(`[AppwriteUserApi] Removing ${shoeId} from favorites`);
          } else {
            // Add to favorites
            newFavorites = [...currentFavorites, shoeId];
            console.log(`[AppwriteUserApi] Adding ${shoeId} to favorites`);
          }

          console.log(
            `[AppwriteUserApi] New favorites:`,
            JSON.stringify(newFavorites, null, 2),
          );

          const response = await databases.updateDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            documentId,
            { favoriteIds: newFavorites },
          );

          console.log(
            `[AppwriteUserApi] Update response:`,
            JSON.stringify(response, null, 2),
          );

          // Deserialize data in response
          const userWithParsedData = {
            ...response,
            location: deserializeLocation(response.location as string),
            cart: deserializeCart(response.cart as string),
          };

          console.log(`[AppwriteUserApi] Favorite toggled successfully`);
          return { data: userWithParsedData as unknown as AppwriteUser };
        } catch (error: any) {
          console.error(`[AppwriteUserApi] Error toggling favorite:`, error);
          return { error: formatError(error) };
        }
      },
      invalidatesTags: (result) =>
        result ? [{ type: "User", id: result.$id }] : [],
    }),

    // Upload profile picture (unchanged)
    uploadUserPicture: builder.mutation<
      { url: string },
      UploadImageRequest & { previousPhotoUrl?: string }
    >({
      queryFn: async ({ uri, userId, previousPhotoUrl }) => {
        try {
          console.log(
            `[AppwriteUserApi] Start uploading for userId: ${userId}, URI: ${uri.substring(0, 30)}...`,
          );

          if (previousPhotoUrl) {
            const previousFileId = extractFileIdFromUrl(previousPhotoUrl);
            if (previousFileId) {
              try {
                console.log(
                  `[AppwriteUserApi] Deleting the old image: ${previousFileId}`,
                );
                await storage.deleteFile(STORAGE_BUCKET_ID, previousFileId);
                console.log(`[AppwriteUserApi] Old image successfully deleted`);
              } catch (deleteError: any) {
                console.warn(
                  `[AppwriteUserApi] Unable to delete the old image: ${deleteError.message}`,
                );
              }
            }
          }

          const fileName = `profile_${userId}_${Date.now()}.jpg`;
          console.log(
            `[AppwriteUserApi] Name of the generated file: ${fileName}`,
          );

          const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
          const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

          const formData = new FormData();
          const fileId = ID.unique();
          formData.append("fileId", fileId);

          const fileObject = {
            uri: uri,
            type: "image/jpeg",
            name: fileName,
          };

          formData.append("file", fileObject as any);

          console.log(`[AppwriteUserApi] Sending the upload request...`);
          const uploadResponse = await fetch(
            `${endpoint}/storage/buckets/${STORAGE_BUCKET_ID}/files`,
            {
              method: "POST",
              headers: {
                "X-Appwrite-Project": projectId!,
              },
              body: formData,
            },
          );

          console.log(
            `[AppwriteUserApi] Response status: ${uploadResponse.status}`,
          );

          const responseText = await uploadResponse.text();

          if (!uploadResponse.ok) {
            throw new Error(
              `Upload failed: ${uploadResponse.status} - ${responseText}`,
            );
          }

          const result = JSON.parse(responseText);
          console.log(`[AppwriteUserApi] File created with ID: ${result.$id}`);

          const imageUrl = `${endpoint}/storage/buckets/${STORAGE_BUCKET_ID}/files/${result.$id}/view?project=${projectId}`;
          console.log(`[AppwriteUserApi] Image URL: ${imageUrl}`);

          return { data: { url: imageUrl } };
        } catch (error: any) {
          console.error(`[AppwriteUserApi] Complete error:`, error);
          return { error: formatError(error) };
        }
      },
    }),

    // Delete user profile (unchanged)
    deleteUserProfile: builder.mutation<void, string>({
      queryFn: async (documentId) => {
        try {
          console.log(`[AppwriteUserApi] Deleting user profile: ${documentId}`);

          await databases.deleteDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            documentId,
          );

          console.log(`[AppwriteUserApi] User profile deleted successfully`);
          return { data: undefined };
        } catch (error: any) {
          console.error(
            `[AppwriteUserApi] Error deleting user profile:`,
            error,
          );
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserProfileMutation,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useToggleFavoriteMutation,
  useUploadUserPictureMutation,
  useDeleteUserProfileMutation,
} = userApi;

// Sélecteurs
export const selectUserProfile = (userId: string) => (state: any) => {
  const { data } = userApi.endpoints.getUserById.select(userId)(state);
  return data || null;
};
