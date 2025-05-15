import { createSlice } from "@reduxjs/toolkit";

export interface ErrorState {
  httpError: boolean;
  httpErrorMessage: string | undefined;
}

const initialState: ErrorState = {
  httpError: false,
  httpErrorMessage: undefined,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setHttpError: (state, action) => {
      state.httpError = action.payload;
    },
    setHttpErrorMessage: (state, action) => {
      state.httpErrorMessage = action.payload;
    },
  },
});

export const { setHttpError, setHttpErrorMessage } = errorSlice.actions;
export default errorSlice.reducer;
