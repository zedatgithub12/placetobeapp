import { Platform } from "react-native";
import Connection from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchAds = async (type) => {
  var id = await AsyncStorage.getItem("userId");
  var userId = id ? id : 0;
  var ApiUrl =
    Connection.url + Connection.fetchAds + `?type=${type}&userid=${userId}`;
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

export const UserInteraction = async (ad, interaction) => {
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
  };

  fetch(ApiUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.success) {
        //
        console.log("reported successfully");
      } else {
        console.log(response.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
