//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import Constants from "../constants/Constants";
import { MaterialCommunityIcons, EvilIcons } from "react-native-vector-icons";
// create a component
const TicketListing = ({
  onPress,
  event,
  type,
  iconName,
  iconColor,
  price,
  status,
  textColor,
  longPress,
}) => {
  return (
    <TouchableNativeFeedback onPress={onPress} onLongPress={longPress}>
      <View style={styles.container}>
        <View style={[styles.iconStyle]}>
          <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
        </View>

        <View style={styles.ticketContent}>
          <Text numberOfLines={2} style={styles.title}>
            {event}
          </Text>
          <Text style={styles.ticketType}>{type}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price} ETB</Text>
          <Text style={[styles.statusstyl, { color: textColor }]}>
            {status}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: "94%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: Constants.tinybox,
    margin: 2,
    padding: 6,
    backgroundColor: Constants.transparentPrimary,
  },
  iconStyle: {
    backgroundColor: Constants.background,
    padding: 8,
    borderRadius: 50,
    marginRight: 15,
  },
  ticketContent: {
    width: "60%",
    marginRight: 10,
  },
  title: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
  },
  priceContainer: {
    width: "19%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  priceText: {
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
  ticketType: {
    color: Constants.Secondary,
    fontWeight: Constants.Boldtwo,
  },
  statusstyl: {
    fontStyle: "italic",
    justifyContent: "flex-end",
  },
});

//make this component available to the app
export default TicketListing;
