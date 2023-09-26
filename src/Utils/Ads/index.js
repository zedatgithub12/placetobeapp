import { Platform } from "react-native";
import Connection from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getUserDeviceToken from "../getUserDeviceToken";

const retrieveToken = async () => {
  const token = await getUserDeviceToken();
  return token;
};

//featch ads from the backend
export const fetchAds = async (type) => {
  const token = await retrieveToken();
  var id = await AsyncStorage.getItem("userId");
  var userId = id ? id : 0;
  var ApiUrl =
    Connection.url +
    Connection.fetchAds +
    `?type=${type}&userid=${userId}&token=${token}`;
  var headers = {
    accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(ApiUrl, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ads");
  }

  const responseData = await response.json();
  return responseData;
};

//save user interaction to database
export const UserInteraction = async (ad, interaction) => {
  //after location is acquired
  const token = await retrieveToken();
  var userId = await AsyncStorage.getItem("userId");
  const deviceType = Platform.OS;

  var ApiUrl = Connection.url + Connection.adViewed;

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
  };

  const data = {
    ad_viewer_id: userId,
    ad_id: ad.id,
    ad_type: ad.ad_type,
    ad_viewer_device: deviceType,
    ad_viewer_action: interaction,
    device_token: token,
    // latitude: latitude,
    // longitude: longitude,
  };

  fetch(ApiUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.success) {
        //the action to be performed
        //when the ad consumption record created
      }
    })
    .catch((error) => {
      // console.log(error);
      //you might want to save the error in the database you can dispatch function from here?
    });
};
