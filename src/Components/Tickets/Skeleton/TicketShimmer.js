//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Constants from "../../../constants/Constants";
// create a component
const TicketShimmer = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.EventContainer}>
        <View style={styles.ImageContainer} />
        <View style={styles.name} />
        <View style={styles.type} />

        <View style={styles.price} />
        <View style={styles.btn} />
      </View>
    </SkeletonPlaceholder>
  );
};

// define your styles
const styles = StyleSheet.create({
  EventContainer: {
    width: 130,
    height: 152,
    justifyContent: "center",
    margin: 4,
    //elevation: 4,
  },
  ImageContainer: {
    width: "100%",
    height: 84,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },

  name: {
    width: "96%",
    height: 12,
    margin: 4,
    marginLeft: 0,
    marginTop: 5,
    borderRadius: 2,
  },
  type: {
    width: "96%",
    height: 12,
    borderRadius: 2,
    marginLeft: 0,
    marginTop: 0,
  },
  price: {
    width: "96%",
    height: 10,
    marginTop: 5,
    marginLeft: 0,
    borderRadius: 2,
  },

  btn: {
    width: "96%",
    height: 18,
    margin: 4,
    marginLeft: 0,
    marginTop: 4,
    borderRadius: 2,
  },
});

//make this component available to the app
export default TicketShimmer;
