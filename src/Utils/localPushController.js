import PushNotification, { Importance } from "react-native-push-notification";
import Constants from "../constants/Constants";
import * as Linking from "expo-linking";

PushNotification.configure({
  onNotification: function (notify) {
    if (notify.data.type == "event") {
      // Linking.openURL("com.afromina.placetobe://event-detail/" + notify.data.id);
      Linking.openURL("http://www.p2b-ethiopia.com/event/" + notify.data.id);
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

export const LocalNotification = (time, title, message, picture, userInfo) => {
  PushNotification.localNotification({
    channelId: "channel-id",
    channelName: "My channel",
    title: title,
    ticker: "Ticker",
    message: message,
    subText: time,
    when: time,
    picture: picture,
    userInfo: userInfo,
    autoCancel: true,
    playSound: true,
    soundName: "default",
    importance: 10,
    vibrate: true,
    vibration: 400,
    color: Constants.primary,
    onlyAlertOnce: false,

    largeIcon: "ic_launcher",
    largeIconUrl: picture,
    bigLargeIcon: "ic_launcher",
    bigLargeIconUrl: picture,
  });
};
