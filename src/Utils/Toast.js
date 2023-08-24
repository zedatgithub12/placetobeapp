import { ToastAndroid } from "react-native";

export const showToast = (message) => {
  ToastAndroid.show(message, ToastAndroid.SHORT); //message to be toasted after user clicked the bookmark button
};
