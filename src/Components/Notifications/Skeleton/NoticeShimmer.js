//import liraries
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Constants from "../../../constants/Constants";
// create a component
const NoticeShimmer = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.innerContainers}>
        <View style={styles.noticeIcon} />

        <View style={styles.noticeContentContainer}>
          <View style={styles.organizer} />
          <View style={styles.title} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

// define your styles
const styles = StyleSheet.create({
  innerContainers: {
    width: "99%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  noticeIcon: {
    width: 50,
    height: 50,
    borderRadius: 23,
    marginLeft: 5,
    justifyContent: "center",
  },
  noticeContentContainer: {
    width: "90%",
    height: 70,
    padding: 10,
    paddingTop: 2,
    justifyContent: "center",
  },
  organizer: {
    width: "90%",
    height: 17,
    borderRadius: 3,
  },
  title: {
    width: "65%",
    height: 13,
    borderRadius: 3,
    marginTop: 8,
  },
  BottomContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  starton: {
    width: 70,
    height: 12,
    borderRadius: 3,
  },
  date: {
    width: 70,
    height: 12,
    borderRadius: 3,
    marginLeft: 5,
  },
  time: {
    width: 70,
    height: 12,
    borderRadius: 3,
    marginLeft: 5,
  },
});

//make this component available to the app
export default NoticeShimmer;
