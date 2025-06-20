import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  authService,
  LoginRequest,
  SignupRequest,
} from "@services/authService";
import { useAuthStore } from "@store/authStore";
import { useErrorStore } from "@store/errorStore";

export function useCurrentUser() {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  useEffect(() => {
    if (query.error) {
      console.error("Auth error:", query.error.message);
    }
  }, [query.error]);

  return query;
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { setHttpError, setHttpErrorMessage } = useErrorStore();

  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      setHttpErrorMessage(error.message);
      setHttpError(true);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { setHttpError, setHttpErrorMessage } = useErrorStore();

  return useMutation({
    mutationFn: authService.signUp,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      setHttpErrorMessage(error.message);
      setHttpError(true);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useListSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: authService.listSessions,
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useUpdateName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: authService.updatePassword,
  });
}

export function useSendPasswordRecovery() {
  return useMutation({
    mutationFn: authService.sendPasswordRecovery,
  });
}

export function useSendEmailVerification() {
  return useMutation({
    mutationFn: authService.sendEmailVerification,
  });
}

export function useRefreshSession() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: authService.refreshSession,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

// Hooks utilitaires
export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();
  const { data: currentUser, isLoading } = useCurrentUser();

  return {
    user: user || currentUser,
    isAuthenticated: isAuthenticated || !!currentUser,
    isLoading,
  };
}

export function useCheckSession() {
  const { data: sessions } = useListSessions();
  const currentUser = useCurrentUser();

  return {
    sessions,
    hasActiveSessions: sessions && sessions.length > 0,
    isCheckingAuth: currentUser.isLoading,
  };
}
