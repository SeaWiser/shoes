import { databases, ID, storage } from "../appwrite";
import { Query } from "react-native-appwrite";
import { AppwriteUser, UserLocation } from "@models/user";
import { Cart } from "@models/cart";

const DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "your-database-id";
const USER_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || "users";
const STORAGE_BUCKET_ID =
  process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "user-images";

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
  favoriteIds?: string[]; // ✅ Garder favoriteIds (pas favoritelds)
  cart?: Cart;
  seenNotifsIds?: string[];
}

export interface UploadImageRequest {
  uri: string;
  userId: string;
}

export interface ToggleFavoriteRequest {
  userId: string;
  documentId: string;
  shoeId: string;
}

const ErrorMessages: Record<number, string> = {
  400: "Invalid data",
  401: "Not allowed",
  404: "User not found",
  409: "The user already exists",
  500: "Server error, please try again",
};

// Fonction utilitaire pour parser JSON de manière sécurisée
const safeJSONParse = <T>(
  jsonString: string | null | undefined,
  fallback: T,
): T => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

// ✅ Fonction utilitaire pour désérialiser un utilisateur (EXTERNE)
const deserializeUser = (user: any): AppwriteUser => {
  console.log("🔄 Désérialisation utilisateur:", user);
  return {
    ...user,
    location: safeJSONParse(user.location, null),
    cart: safeJSONParse(user.cart, null),
    // ✅ Mapper favoritelds → favoriteIds si nécessaire
    favoriteIds: user.favoriteIds || user.favoritelds || [],
  } as AppwriteUser;
};

// ✅ Fonction utilitaire pour extraire l'ID du fichier (EXTERNE)
const extractFileIdFromUrl = (photoUrl?: string): string | null => {
  if (!photoUrl) return null;

  try {
    const url = new URL(photoUrl);
    const pathSegments = url.pathname.split("/");
    const fileIdIndex = pathSegments.findIndex(
      (segment) => segment === "files",
    );

    if (fileIdIndex !== -1 && pathSegments[fileIdIndex + 1]) {
      return pathSegments[fileIdIndex + 1];
    }

    return null;
  } catch (error) {
    console.error("Error extracting file ID from URL:", error);
    return null;
  }
};

export const userService = {
  async createUserProfile({
    userId,
    email,
    fullName,
    location,
  }: CreateUserRequest): Promise<AppwriteUser> {
    try {
      const userData = {
        userId,
        email,
        fullName: fullName || "",
        photoUrl: "",
        location: location ? JSON.stringify(location) : null,
        favoriteIds: [], // ✅ Utiliser favoriteIds
        cart: JSON.stringify({ shoes: [], totalAmount: 0 }),
        seenNotifsIds: [],
      };

      console.log("📤 Création profil utilisateur:", userData);

      const response = await databases.createDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        ID.unique(),
        userData,
      );

      return deserializeUser(response);
    } catch (error: any) {
      console.error("❌ Erreur création profil:", error);
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async getUserById(userId: string): Promise<AppwriteUser> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.equal("userId", userId)],
      );

      if (response.documents.length === 0) {
        throw new Error("User profile not found");
      }

      return deserializeUser(response.documents[0]);
    } catch (error: any) {
      console.error("❌ Erreur récupération utilisateur:", error);
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async updateUserProfile(
    data: UpdateUserRequest & { documentId: string },
  ): Promise<AppwriteUser> {
    try {
      const { documentId, ...updateData } = data;

      console.log("📝 Mise à jour profil:", { documentId, updateData });

      const payload: Record<string, any> = {};

      if (updateData.fullName !== undefined) {
        payload.fullName = updateData.fullName;
      }
      if (updateData.photoUrl !== undefined) {
        payload.photoUrl = updateData.photoUrl;
      }
      if (updateData.location !== undefined) {
        payload.location = JSON.stringify(updateData.location);
      }
      if (updateData.favoriteIds !== undefined) {
        payload.favoriteIds = updateData.favoriteIds; // ✅ Garder en tableau
      }
      if (updateData.cart !== undefined) {
        payload.cart = JSON.stringify(updateData.cart);
      }
      if (updateData.seenNotifsIds !== undefined) {
        payload.seenNotifsIds = updateData.seenNotifsIds;
      }

      console.log(
        "✅ Payload envoyé à Appwrite:",
        JSON.stringify(payload, null, 2),
      );

      const response = await databases.updateDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        documentId,
        payload,
      );

      console.log("✅ Réponse Appwrite:", response);

      return deserializeUser(response);
    } catch (error: any) {
      console.error("❌ Erreur mise à jour profil:", error);
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async uploadUserPicture(
    data: UploadImageRequest & { previousPhotoUrl?: string },
  ): Promise<{ url: string }> {
    try {
      const { uri, userId, previousPhotoUrl } = data;

      console.log("📤 Upload image:", { userId, previousPhotoUrl });

      // ✅ Supprimer l'ancienne image si elle existe
      if (previousPhotoUrl) {
        const fileId = extractFileIdFromUrl(previousPhotoUrl);
        if (fileId) {
          try {
            await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
            console.log("✅ Ancienne image supprimée:", fileId);
          } catch (deleteError) {
            console.warn("⚠️ Échec suppression ancienne image:", deleteError);
          }
        }
      }

      const fileId = ID.unique();
      const fileName = `profile_${userId}_${Date.now()}.jpg`;

      console.log("📤 Upload avec API REST - File ID:", fileId);

      // ✅ Utiliser l'API REST pour React Native
      const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
      const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

      const formData = new FormData();
      formData.append("fileId", fileId);

      // ✅ Structure correcte pour React Native
      const fileObject = {
        uri: uri,
        type: "image/jpeg",
        name: fileName,
      } as any;

      formData.append("file", fileObject);

      console.log("📤 Envoi de la requête upload...");

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

      console.log("📤 Statut de la réponse:", uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("❌ Erreur upload:", errorText);
        throw new Error(
          `Upload failed: ${uploadResponse.status} - ${errorText}`,
        );
      }

      const uploadResult = await uploadResponse.json();
      console.log("✅ Fichier uploadé:", uploadResult);

      // ✅ Construire l'URL de visualisation
      const imageUrl = `${endpoint}/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadResult.$id}/view?project=${projectId}`;
      console.log("✅ URL générée:", imageUrl);

      return { url: imageUrl };
    } catch (error: any) {
      console.error("❌ Erreur upload image complète:", {
        message: error.message,
        stack: error.stack,
        error: error,
      });
      throw new Error(
        ErrorMessages[error.code] || error.message || "Upload failed",
      );
    }
  },

  async toggleFavorite({
    userId,
    documentId,
    shoeId,
  }: ToggleFavoriteRequest): Promise<AppwriteUser> {
    try {
      console.log("🔄 Toggle favorite:", { userId, documentId, shoeId });

      const currentUser = await databases.getDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        documentId,
      );

      const currentFavorites = Array.isArray(currentUser.favoriteIds)
        ? currentUser.favoriteIds
        : [];

      let newFavorites: string[];
      if (currentFavorites.includes(shoeId)) {
        newFavorites = currentFavorites.filter((id: string) => id !== shoeId);
        console.log("➖ Suppression du favori");
      } else {
        newFavorites = [...currentFavorites, shoeId];
        console.log("➕ Ajout aux favoris");
      }

      console.log("📋 Nouveaux favoris:", newFavorites);

      const response = await databases.updateDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        documentId,
        { favoriteIds: newFavorites },
      );

      return deserializeUser(response);
    } catch (error: any) {
      console.error("❌ Erreur toggle favorite:", error);
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async deleteUserProfile(documentId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        documentId,
      );
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  // ✅ Supprimer ces méthodes qui causent l'erreur
  // deserializeUser, extractFileIdFromUrl, sanitizeUserData sont maintenant des fonctions externes
};
