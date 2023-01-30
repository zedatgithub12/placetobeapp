//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Constants from "../constants/Constants";
// create a component
const TicketShimmer = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.EventContainer}>
        <View style={styles.ImageContainer} />
        <View style={styles.VenueName} />
        <View style={styles.type}/>
        
            <View style={styles.price}/>
            <View style={styles.checkin}/>
     
      </View>
    </SkeletonPlaceholder>
  );
};

// define your styles
const styles = StyleSheet.create({
  EventContainer: {
    width: 150,
    height: 178,
    justifyContent: "center",
    margin: 4,
    //elevation: 4,
  },
  ImageContainer: {
    width: "100%",
    height: 100,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },

  VenueName: {
    width: "80%",
    height: 12,
    margin:4,
    marginLeft:4,
    marginTop:4,
    borderRadius: 3,
    
  },
  type:{
    width: "70%",
    height: 8,
    borderRadius:3,
    marginLeft:4,
    marginTop:6,
  },
  price: {
  width: "60%",
  height: 14,
  marginTop:14,
  marginLeft:4,
  borderRadius:3
  
  },
  checkin: {
    width: "25%",
    height: 16,
    marginTop:18,
    marginRight:4,
    position: "absolute",
    right:2,
    bottom:0,
    borderRadius:3
  },

});

//make this component available to the app
export default TicketShimmer;
