import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { account, ID } from "../../appwrite";

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

const formatError = (error: any) => {
  return {
    status: error.code || 500,
    data: ErrorMessages[error.code] || error.message || "An error has occurred",
  };
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["User", "Session"],
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: async ({ email, password }) => {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );
          const user = await account.get();

          return {
            data: {
              user: user as User,
              sessionId: session.$id,
            },
          };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["User", "Session"],
    }),

    signUp: builder.mutation<AuthResponse, SignupRequest>({
      queryFn: async ({ email, password }) => {
        let generatedUserId: string | undefined = undefined;
        try {
          generatedUserId = ID.unique();
          console.log(
            `[AppwriteAuthApi] Attempting to create user with generated userId: ${generatedUserId}, email: ${email}`,
          );
          await account.create(generatedUserId, email, password);
          console.log(
            `[AppwriteAuthApi] User created successfully with userId: ${generatedUserId}`,
          );

          // Introduce a small delay for diagnostic purposes
          console.log(
            "[AppwriteAuthApi] Introducing a 1 second delay before creating session...",
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

          console.log(
            `[AppwriteAuthApi] Attempting to create session for email: ${email}`,
          );
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );
          console.log(
            `[AppwriteAuthApi] Session created successfully, sessionId: ${session.$id}`,
          );

          console.log(`[AppwriteAuthApi] Attempting to get user details`);
          const user = await account.get();
          console.log(
            `[AppwriteAuthApi] User details retrieved successfully: ${user.email}`,
          );

          return {
            data: {
              user: user as User,
              sessionId: session.$id,
            },
          };
        } catch (error: any) {
          console.error(
            `[AppwriteAuthApi] Error during signUp process. Generated userId was: ${generatedUserId}. Error details: `,
            JSON.stringify(error, null, 2), // Stringify for better object logging
          );
          return { error: formatError(error) }; // Ensure formatError is used
        }
      },
      invalidatesTags: ["User", "Session"],
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          await account.deleteSession("current");
          return { data: { success: true } };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["User", "Session"],
    }),

    getCurrentUser: builder.query<User | null, void>({
      queryFn: async () => {
        try {
          const user = await account.get();
          return { data: user as User };
        } catch (error: any) {
          // Return null if user is not authenticated
          if (error.code === 401) {
            return { data: null };
          }
          return { error: formatError(error) };
        }
      },
      providesTags: ["User"],
    }),

    listSessions: builder.query<Session[], void>({
      queryFn: async () => {
        try {
          const response = await account.listSessions();
          return { data: response.sessions as Session[] };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
      providesTags: ["Session"],
    }),

    deleteSession: builder.mutation<void, string>({
      queryFn: async (sessionId) => {
        try {
          await account.deleteSession(sessionId);
          return { data: undefined };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["Session"],
    }),

    updateName: builder.mutation<User, string>({
      queryFn: async (name) => {
        try {
          await account.updateName(name);
          const user = await account.get();
          return { data: user as User };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["User"],
    }),

    updateEmail: builder.mutation<User, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          await account.updateEmail(email, password);
          const user = await account.get();
          return { data: user as User };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["User"],
    }),

    updatePassword: builder.mutation<
      void,
      { newPassword: string; oldPassword: string }
    >({
      queryFn: async ({ newPassword, oldPassword }) => {
        try {
          await account.updatePassword(newPassword, oldPassword);
          return { data: undefined };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
    }),

    sendPasswordRecovery: builder.mutation<void, string>({
      queryFn: async (email) => {
        try {
          const url =
            process.env.EXPO_PUBLIC_PASSWORD_RESET_URL ||
            "https://yourapp.com/reset-password";
          await account.createRecovery(email, url);
          return { data: undefined };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
    }),

    sendEmailVerification: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          const url =
            process.env.EXPO_PUBLIC_EMAIL_VERIFY_URL ||
            "https://yourapp.com/verify-email";
          await account.createVerification(url);
          return { data: undefined };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
    }),

    refreshSession: builder.mutation<AuthResponse, void>({
      queryFn: async () => {
        try {
          const user = await account.get();
          const sessions = await account.listSessions();
          const currentSession = sessions.sessions.find((s: any) => s.current);

          if (!currentSession) {
            return {
              error: {
                status: 401,
                data: "No active sessions found",
              },
            };
          }

          return {
            data: {
              user: user as User,
              sessionId: currentSession.$id,
            },
          };
        } catch (error: any) {
          return { error: formatError(error) };
        }
      },
      invalidatesTags: ["User", "Session"],
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useListSessionsQuery,
  useDeleteSessionMutation,
  useUpdateNameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useSendPasswordRecoveryMutation,
  useSendEmailVerificationMutation,
  useRefreshSessionMutation,
} = authApi;

export const selectCurrentUser = (state: any) => {
  const { data } = authApi.endpoints.getCurrentUser.select()(state);
  return data || null;
};

export const selectIsAuthenticated = (state: any) => {
  const { data } = authApi.endpoints.getCurrentUser.select()(state);
  return !!data;
};

export const useAuth = () => {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError: !!error,
  };
};

export const useCheckSession = () => {
  const { data: user, isLoading } = useGetCurrentUserQuery(undefined, {
    // Vérifier la session au montage et au focus
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
};
