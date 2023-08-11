import messaging from '@react-native-firebase/messaging';

// Initialize Firebase
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message:', remoteMessage);
});

// Request permission for notifications
messaging().requestPermission();