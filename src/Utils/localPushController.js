import PushNotification, { Importance } from "react-native-push-notification";
import Constants from "../../constants/Constants";
import * as Linking from "expo-linking";



PushNotification.configure({
  onNotification: function (notify) {
    
    if (notify.data.type == "events") {
       Linking.openURL('com.afromina.placetobe://eventdetail/'+notify.data.id);
     
    }
  },
  popInitialNotification: true,
  requestPermissions: true,
});
PushNotification.createChannel({
  channelId: "channel-id", // (required)
  channelName: "My channel", // (required)
  channelDescription: "A channel is for notification",
  playSound: true,
  soundName: "default",
  importance: Importance.HIGH,
  vibrate: true,
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
    playSound: true,
    soundName: "default",
    importance: 10,
    vibrate: true,
    vibration: 1000,
    color: Constants.primary,
    onlyAlertOnce: false,
  });
};
