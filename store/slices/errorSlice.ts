import { createSlice } from "@reduxjs/toolkit";

export interface ErrorState {
  httpError: boolean;
}

const initialState: ErrorState = {
  httpError: false,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setHttpError: (state, action) => {
      state.httpError = action.payload;
    },
  },
});

export const { setHttpError } = errorSlice.actions;
export default errorSlice.reducer;
