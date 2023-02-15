import PushNotification, { Importance } from "react-native-push-notification";
import Constants from "../../constants/Constants";
import { useNavigation } from '@react-navigation/native';




PushNotification.configure({
  onNotification: function (notify) {
    // console.log("notify", notify.data.type);
    // if (notify.data.type == "events") {
    //     navigation.push("EventDetail", { id: notify.data.id });
    // }
  },
  popInitialNotification: true,
  requestPermissions: true,
});
PushNotification.createChannel({
  channelId: "channel-id", // (required)
  channelName: "My channel", // (required)
  channelDescription: "A channel is for notification",
  playSound: false,
  soundName: "default",
  importance: Importance.HIGH,
  vibrate: false,
});
// PushNotification.onNotification = (notify, navigation) => {
//   console.log("notify", notify.data.type);
//   if (notify.data.type && notify.data.notify == "events") {
//     navigation.navigate("EventDetail", { id: notify.data.id });
//   }
// };

export const LocalNotification = (
  title,
  bigText,
  message,
  time,
  picture,
  userInfo,

) => {
  PushNotification.localNotification({
    channelId: "channel-id",
    channelName: "my channel",
    title: title,
    message: message,
    bigText: bigText,
    subText: time,
    picture: picture,
    userInfo: userInfo,
    autoCancel: true,
    playSound: false,
    soundName: "default",
    importance: 10,
    vibrate: false,
    vibration: 1000,
    color: Constants.primary,
    onlyAlertOnce: true,
  });
};
