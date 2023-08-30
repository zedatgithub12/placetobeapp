//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import NoticeShimmer from "../../../Components/Notifications/Skeleton/NoticeShimmer";

// Notification shimmer effect
const NotificationSkeleton = () => {
  return (
    <View>
      <View>
        <NoticeShimmer />
        <NoticeShimmer />
        <NoticeShimmer />
        <NoticeShimmer />
        <NoticeShimmer />
        <NoticeShimmer />
        <NoticeShimmer />
        <NoticeShimmer />
        <NoticeShimmer />
      </View>
    </View>
  );
};

//make this component available to the app
export default NotificationSkeleton;
