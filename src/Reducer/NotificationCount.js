import { createSlice } from "@reduxjs/toolkit";
const initialtime = new Date().toLocaleTimeString("en-US", { hour12: false });

const initialState = {
  notificationCount: 0,
  checkedat: initialtime,
};

const NotificationCountSlice = createSlice({
  name: "notifications",
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
