import React from "react";
import PushNotification, { Importance } from "react-native-push-notification";
import Constants from "../constants/Constants";
import * as Linking from "expo-linking";

PushNotification.configure({
  appId: Constants.notificationappid,
  apiKey: Constants.notificationapikey,
  senderId: Constants.notificationsenderid,

  popInitialNotification: true,
  requestPermissions: true,
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  onNotification: function (notification) {
    // Handle onPress event when the notification is tapped

    if (notification.userInteraction) {
      const parseData = notification.data;
      if (parseData.url) {
        var url = parseData.url;
        const { path } = Linking.parse(url);
        const pathSegments = path.split("/");
        if (pathSegments[0] === "event") {
          const eventId = pathSegments[1];
          // navigate("EventDetail", { id: eventId });
        }
      }
    }
  },
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
