import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface NotificationsState {
  seenNotificationsIds: string[];
}

const initialState: NotificationsState = {
  seenNotificationsIds: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addSeenNotification: (state, action: PayloadAction<string>) => {
      state.seenNotificationsIds = [
        ...state.seenNotificationsIds,
        action.payload,
      ];
    },
  },
});

export const { addSeenNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
