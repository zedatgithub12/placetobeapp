import firebase from "@react-native-firebase/app";

const getUserDeviceToken = async () => {
  try {
    const messaging = firebase.messaging();
    const token = await messaging.getToken();
    return token;
  } catch (error) {
    return null;
  }
};

export default getUserDeviceToken;
