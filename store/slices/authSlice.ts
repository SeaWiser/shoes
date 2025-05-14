import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | undefined;
}

const initialState: AuthState = {
  token: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
