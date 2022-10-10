import { createSlice } from "@reduxjs/toolkit";




const saveSlice = createSlice({
  name: "save",
  initialState:{
      items: [],
      
  },
  reducers: {
    bookmarkItem: (state, action) => {

      //const find = state.items.find((event) => event.event_id === item.event_id);

      //if(!find){
        state.items.push({
          ...action.payload
        });
     // }
       
     
     
    },
    remove: (state, action) => {
      state.items = state.items.filter((item) => item.event_id !== action.payload);
    },
  },
});

export const { remove, bookmarkItem } = saveSlice.actions;
export default saveSlice.reducer;
