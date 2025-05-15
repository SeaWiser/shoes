import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | undefined;
  userId: string | undefined;
}

const initialState: AuthState = {
  token: undefined,
  userId: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setToken, setUserId } = authSlice.actions;
export default authSlice.reducer;
