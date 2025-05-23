import {
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { setHttpError, setHttpErrorMessage } from "../slices/errorSlice";

const errorMessages = {
  EMAIL_EXISTS: "Cet email est déjà utilisé",
  INVALID_LOGIN_CREDENTIALS: "Ces identifiants sont incorrects",
};

interface ErrorPayload {
  data?: {
    error?: {
      message?: string;
    };
  };
}

export const rtkQueryErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action: any) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as ErrorPayload;
      const code = payload?.data?.error?.message;

      api.dispatch(
        setHttpErrorMessage(
          (code && errorMessages[code as keyof typeof errorMessages]) ||
            "Une erreur est survenue. Veuillez ré-essayer ultérieurement",
        ),
      );
      api.dispatch(setHttpError(true));
    }
    return next(action);
  };
