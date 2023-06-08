//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import Constants from "../../constants/Constants";
import { MaterialCommunityIcons, Ionicons } from "react-native-vector-icons";
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
          <Text style={styles.ticketType}>{type} Ticket</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price} ETB</Text>
          <Text style={[styles.statusstyl, { color: textColor }]}>
            {status === "Sold-out" ? (
              <Ionicons
                name="ios-checkmark-circle-outline"
                size={13}
                color={Constants.Secondary}
              />
            ) : null}

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
    width: Dimensions.get("screen").width / 2.1,
    height: 150,
    justifyContent: "space-between",
    borderRadius: Constants.tinybox,
    margin: 2,
    padding: 6,
    backgroundColor: Constants.background,
  },
  iconStyle: {
    backgroundColor: Constants.Faded,
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
  },
  ticketContent: {
    paddingHorizontal: 5,
  },
  title: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 5,
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
