import { create } from "zustand";

interface ErrorState {
  httpError: boolean;
  httpErrorMessage: string | undefined;
  setHttpError: (error: boolean) => void;
  setHttpErrorMessage: (message: string | undefined) => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  httpError: false,
  httpErrorMessage: undefined,
  setHttpError: (httpError) => set({ httpError }),
  setHttpErrorMessage: (httpErrorMessage) => set({ httpErrorMessage }),
}));
