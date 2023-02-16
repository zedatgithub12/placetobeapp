import PushNotification, { Importance } from "react-native-push-notification";
import Constants from "../../constants/Constants";
import * as Linking from "expo-linking";



PushNotification.configure({
  onNotification: function (notify) {
    
    if (notify.data.type == "events") {
       Linking.openURL('https://www.p2b-ethiopia.com/eventDetail/'+notify.data.id);
       console.log('www.p2b-ethiopia.com/details/'+notify.data.id);
    }
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
    channelName: "My channel",
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
