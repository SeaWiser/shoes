import { Cart } from "./cart";
import { UserLocation } from "./user";

export interface ProfileFormUser {
  $id: string;
  userId: string;
  email: string;
  fullName?: string; // ✅ Optionnel pour correspondre à AppwriteUser
  photoUrl?: string;
  location?: UserLocation;
  favoriteIds?: string[];
  cart?: Cart;
  seenNotifsIds?: string[];
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  updated_at: string;
}

export interface ProfileImage {
  uri: string | undefined;
  new: boolean;
}
