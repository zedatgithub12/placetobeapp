import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RemotePushController = () => {
  useEffect(() => {
    // Initialize Firebase
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background Message:", remoteMessage);
    });

    // Request permission for notifications
    messaging().requestPermission();

    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        // Send the token to your backend server for later use
        const deviceOS = Platform.OS;
        // Make a network request to send the token and deviceOS to your server
        sendTokenToServer(token, deviceOS);
      });

    // Handle token refresh
    messaging().onTokenRefresh((token) => {
      console.log("Token Refreshed:", token);
      // Send the updated token to your backend server
      const deviceOS = Platform.OS;
      // Make a network request to send the updated token and deviceOS to your server
      sendTokenToServer(token, deviceOS);
    });

    // Handle foreground notifications
    messaging().onMessage((remoteMessage) => {
      console.log("Foreground Message:", remoteMessage);
      // Display the notification or handle it as needed
    });

    // Handle notification taps
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification Tapped:", remoteMessage);
      // Navigate to the appropriate screen based on the notification data
    });

    // Check if the app was opened from a notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("App Opened from Notification:", remoteMessage);
          // Navigate to the appropriate screen based on the notification data
        }
      });
  }, []);

  const sendTokenToServer = async (token, deviceOS) => {
    const device_token = await AsyncStorage.getItem("device-token");
    const device_OS = await AsyncStorage.getItem("device-os");
  };

  return null; // or you can return a component if needed
};

export default RemotePushController;
