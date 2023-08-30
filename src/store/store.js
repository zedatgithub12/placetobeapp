import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "../Reducer/saveSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ticket from "../Reducer/Ticket";
import Timer from "../Reducer/TimerSlice";
import NotificationCountSlice from "../Reducer/NotificationCount";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const reducer = combineReducers({
  cart: CartReducer,
  ticket: Ticket,
  timer: Timer,
  counts: NotificationCountSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  //{
  //   cart: CartReducer
  // },
});

export default store;
