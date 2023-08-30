import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
};

const NotificationCountSlice = createSlice({
  name: "notification_count",
  initialState,
  reducers: {
    incrementNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    decrementNotificationCount: (state) => {
      state.notificationCount -= 1;
    },
    resetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
  },
});

export const {
  incrementNotificationCount,
  decrementNotificationCount,
  resetNotificationCount,
} = NotificationCountSlice.actions;

export default NotificationCountSlice.reducer;
