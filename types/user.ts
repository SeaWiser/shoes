import { Models } from "react-native-appwrite";
import { Cart } from "@models/cart";

export interface UserLocation {
  postalCode?: string;
  street?: string;
  city?: string;
}

export interface AppwriteUser extends Models.Document {
  userId: string; // Appwrite Auth user ID
  email: string;
  fullName: string;
  photoUrl?: string;
  location?: UserLocation;
  favoriteIds?: string[];
  cart?: Cart;
  seenNotifsIds?: string[];
}

// Types from the old system (Firebase) - to be kept for compatibility
export interface LegacyUser {
  id: string;
  email: string;
  fullName: string;
  photoUrl?: string;
  location?: UserLocation;
  favoritesIds?: string[];
  seenNotifsIds?: string[];
  cart?: any[];
}

// Unified interface for forms
export interface UserFormValues {
  fullName: string;
  location: UserLocation;
}

// Interface for ProfileForm - compatible with the old system
export interface ProfileFormUser {
  $id?: string; // Pour Appwrite
  id?: string; // Pour Firebase (legacy)
  email: string;
  fullName: string;
  photoUrl?: string;
  location?: UserLocation;
  favoritesIds?: string[];
  seenNotifsIds?: string[];
  cart?: any[];
}

// Utility function to convert AppwriteUser to ProfileFormUser
export const adaptAppwriteUserForForm = (
  appwriteUser: AppwriteUser,
): ProfileFormUser => {
  return {
    $id: appwriteUser.$id,
    id: appwriteUser.$id, // Use the document ID as the legacy ID
    email: appwriteUser.email,
    fullName: appwriteUser.fullName,
    photoUrl: appwriteUser.photoUrl,
    location: appwriteUser.location,
    // Default properties for compatibility
    favoritesIds: appwriteUser.favoriteIds || [],
    seenNotifsIds: appwriteUser.seenNotifsIds || [],
    cart: [],
  };
};

// Type guard to verify if it is an Appwrite user
export const isAppwriteUser = (user: any): user is AppwriteUser => {
  return user && "$id" in user && "userId" in user;
};
