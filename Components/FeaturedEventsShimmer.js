//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Constants from "../constants/Constants";
// create a component
const FeaturedShimmer = () => {
  return (
    <SkeletonPlaceholder>
      <View
        style={styles.innerContainers}
      >
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
    borderRadius: 12,
    marginLeft: 5,
    justifyContent:"center"
  },
  noticeContentContainer: {
    width: "90%",
    height: 60,
    padding: 10,
    paddingTop:2,
    justifyContent:"center"
  },
  organizer: {
    width: "90%",
    height: 15,
    borderRadius: 3,
  },
  title: {
    width: "65%",
    height: 13,
    borderRadius: 3,
    marginTop: 8,
  },

});

//make this component available to the app
export default FeaturedShimmer;
