import { account, ID } from "../appwrite";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {}

export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  status: boolean;
  passwordUpdate: string;
  registration: string;
  prefs: Record<string, any>;
}

export interface Session {
  $id: string;
  $createdAt: string;
  userId: string;
  expire: string;
  provider: string;
  current: boolean;
}

export interface AuthResponse {
  user: User;
  sessionId?: string;
}

const ErrorMessages: Record<number, string> = {
  401: "Incorrect email or password",
  409: "An account already exists with this email address.",
  429: "Too many attempts, please try again later",
  500: "Server error, please try again",
};

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return user;
    } catch (error: any) {
      if (error.code === 401) {
        return null;
      }
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async signIn({ email, password }: LoginRequest): Promise<AuthResponse> {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return { user, sessionId: session.$id };
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async signUp({ email, password }: SignupRequest): Promise<AuthResponse> {
    try {
      const userId = ID.unique();
      await account.create(userId, email, password);

      // Add a small delay to ensure account creation is complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return { user, sessionId: session.$id };
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      await account.deleteSession("current");
      return { success: true };
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async listSessions(): Promise<Session[]> {
    try {
      const sessions = await account.listSessions();
      return sessions.sessions;
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await account.deleteSession(sessionId);
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async updateName(name: string): Promise<User> {
    try {
      const user = await account.updateName(name);
      return user;
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async updateEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const user = await account.updateEmail(email, password);
      return user;
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async updatePassword({
    newPassword,
    oldPassword,
  }: {
    newPassword: string;
    oldPassword: string;
  }): Promise<void> {
    try {
      await account.updatePassword(newPassword, oldPassword);
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async sendPasswordRecovery(email: string): Promise<void> {
    try {
      await account.createRecovery(
        email,
        `${process.env.EXPO_PUBLIC_APP_URL}/reset-password`,
      );
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async sendEmailVerification(): Promise<void> {
    try {
      await account.createVerification(
        `${process.env.EXPO_PUBLIC_APP_URL}/verify-email`,
      );
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },

  async refreshSession(): Promise<AuthResponse> {
    try {
      const user = await account.get();
      return { user };
    } catch (error: any) {
      throw new Error(ErrorMessages[error.code] || error.message);
    }
  },
};
