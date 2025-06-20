import { Models } from "react-native-appwrite";
import { Cart } from "@models/cart";
import { ProfileFormUser } from "./profile";

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
  favoriteIds?: string[]; // ✅ Garder favoriteIds
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
  email: string;
  fullName?: string;
  location?: UserLocation;
}

// Utility function to convert AppwriteUser to ProfileFormUser
export const adaptAppwriteUserForForm = (
  appwriteUser: AppwriteUser,
): ProfileFormUser => {
  return {
    $id: appwriteUser.$id,
    userId: appwriteUser.userId,
    email: appwriteUser.email,
    fullName: appwriteUser.fullName,
    photoUrl: appwriteUser.photoUrl,
    location: appwriteUser.location,
    favoriteIds: appwriteUser.favoriteIds || [],
    seenNotifsIds: appwriteUser.seenNotifsIds || [],
    cart: appwriteUser.cart || { shoes: [], totalAmount: 0 },
  };
};

// Type guard to verify if it is an Appwrite user
export const isAppwriteUser = (user: any): user is AppwriteUser => {
  return user && "$id" in user && "userId" in user;
};
