import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timerRunning: false,
  remainingTime: 12 * 60, // 12 minutes in seconds
  ticketData: [],
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state, { payload }) => {
      state.remainingTime = 12 * 60;
      state.timerRunning = true;
      state.ticketData = payload;
    },
    stopTimer: (state) => {
      state.timerRunning = false;
      state.ticketData = null;
    },
    decreaseTime: (state) => {
      state.remainingTime -= 1;
    },
    releaseTicket: (state) => {
      state.ticketData = null;
    },
  },
});

export const { startTimer, stopTimer, decreaseTime, releaseTicket } =
  timerSlice.actions;

export default timerSlice.reducer;
