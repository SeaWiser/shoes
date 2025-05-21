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
