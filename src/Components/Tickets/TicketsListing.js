//import liraries
import React from "react";
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
      <View
        style={[
          styles.container,
          { borderRightWidth: 2, borderColor: iconColor },
        ]}
      >
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
    height: 160,
    justifyContent: "space-between",
    borderRadius: Constants.medium,
    borderTopRightRadius: 0,
    borderBottomEndRadius: 0,
    margin: 3,
    padding: 6,
    backgroundColor: Constants.background,
  },
  iconStyle: {
    padding: 8,
    borderRadius: 50,
  },
  ticketContent: {
    paddingHorizontal: 5,
  },
  title: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },
  ticketType: {
    color: Constants.Inverse,
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  priceText: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },

  statusstyl: {
    justifyContent: "flex-end",
    fontSize: Constants.textSize,
  },
});

//make this component available to the app
export default TicketListing;
