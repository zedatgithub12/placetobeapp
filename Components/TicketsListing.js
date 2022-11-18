//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import Constants from "../constants/Constants";
import { MaterialCommunityIcons } from "react-native-vector-icons";
// create a component
const TicketListing = ({ event, type, price }) => {
  return (
    <TouchableNativeFeedback>
      <View style={styles.container}>
        <View style={styles.iconStyle}>
          <MaterialCommunityIcons
            name="ticket"
            size={24}
            color={Constants.primary}
          />
        </View>

        <View style={styles.ticketContent}>
          <Text numberOfLines={2}>{event}</Text>
          <Text>{type}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price} ETB</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: "96%",
    backgroundColor: Constants.Faded,
   // elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "flex-start",
    padding: 6,
    // paddingHorizontal:15,
    margin: 6,
    marginTop: 2,
    marginBottom: 2,
    borderRadius: Constants.tinybox,
  },
  iconStyle: {
    width:"13%",
    backgroundColor: Constants.transparentPrimary,
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  ticketContent: {
    width:"60%",
    marginRight: 10,
  },
  priceContainer: {
    width:"19%",
    justifyContent:"flex-end",
    alignItems:"center"
    
    
  },
});

//make this component available to the app
export default TicketListing;
