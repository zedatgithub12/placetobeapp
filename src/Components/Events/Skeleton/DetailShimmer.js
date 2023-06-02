//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Constants from "../../../constants/Constants";

// create a component
const DetailShimmer = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.listContainer} />


      <View style={styles.topContainer}>
        <View style={styles.Title} />
        <View style={styles.topItems} />
        <View style={styles.topItems} />
      </View>

      <View style={styles.topContainer}>
      
     
        <View style={styles.date} />
     
      </View>
      <View style={styles.topContainer}>
      
        <View style={styles.place} />
      </View>
      <View style={styles.topContainer}>
      
        <View style={styles.price} />
      </View>
     
    
      <View style={styles.description}/>

      <View style={styles.texts}/>
      <View style={styles.texts}/>
      <View style={styles.texts}/>
      <View style={styles.texts}/>
      <View style={styles.texts}/>

    </SkeletonPlaceholder>
  );
};

// define your styles
const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    width: "96%",
    height: 350,
    marginTop: 12,
    marginHorizontal: 8,
    borderRadius: Constants.medium,
  },
  topContainer: {
    width: "98%",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
   margin:2,
  },
  Title: {
    width: 270,
    padding: 14,
    marginLeft:6,
    
    borderRadius: 4,
  },
  date: {
    width: 260,
    padding: 10,
    marginLeft:6,
    borderRadius: 4,
  },
  place: {
    width: 260,
    padding: 10,
    marginLeft:6,
    
    borderRadius: 4,
  },

  price: {
    width: 260,
    padding: 10,
    marginLeft:6,
    
    borderRadius: 4,
  },
  topItems: {
    padding: 14,
    margin: 8,
   
    borderRadius: 50,
  },
  description:{
    width: 160,
    padding: 8,
    marginLeft:12,
    marginTop:20,
    borderRadius: 4,
  },
   texts:{
    width: 340,
    padding: 6,
    marginLeft:22,
    marginTop:14,
    borderRadius: 2,
   }
});

//make this component available to the app
export default DetailShimmer;
