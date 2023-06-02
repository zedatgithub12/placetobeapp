import { createSlice } from "@reduxjs/toolkit";

const NoticeSlice = createSlice({
  name: "notice",
  initialState: {
    notices: [],
  },
  reducers: {
    noticeObject: (state, action) => {
      const find = state.notices.find((event) => event.event_id === item.event_id);

      if(!find){
      state.notices.push({
        ...action.payload,
      });
      }
    },
    remove: (state, action) => {
      state.notices = state.notices.filter(
        (item) => item.event_id !== action.payload
      );
    },
  },
});

export const { remove, noticeObject } = NoticeSlice.actions;
export default NoticeSlice.reducer;
