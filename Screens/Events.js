//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import MyTabs from "./TopTab";
// create a component
const Events = ({ navigation }) => {
  return (
    <View style={styles.container}>
    

     <MyTabs />
      
    
    </View>
    
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
 
  },
});

//make this component available to the app
export default Events;
