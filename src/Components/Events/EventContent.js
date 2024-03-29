import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
} from "react-native-vector-icons";
import Constants from "../../constants/Constants";
import call from "react-native-phone-call";
import * as Linking from "expo-linking";

const DetailContent = ({ ...props }) => {
  const cancelled = props.isCancelled == "1" ? true : false;
  const free = "Free";
  const currency = " ETB";
  const MakeCall = (phone) => {
    const args = {
      number: phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args);
  };

  return (
    <View
      style={styles.topContent} //event detail text content container component
    >
      <View style={styles.subContainer}>
        <FontAwesome
          name="calendar-check-o"
          size={22}
          style={styles.iconContainer}
        />
        <View style={styles.eventDate}>
          <Text style={cancelled ? styles.cancelled : styles.happening}>
            {props.StartDate} @{props.StartTime}
          </Text>
          <Text style={styles.time} numberOfLines={1}>
            Happening Date
          </Text>
        </View>
      </View>
      <View style={styles.subContainer}>
        <FontAwesome
          name="calendar-times-o"
          size={22}
          style={styles.iconContainer}
        />
        <View style={styles.eventDate}>
          <Text style={cancelled ? styles.cancelled : styles.happening}>
            {props.EndDate} @{props.EndTime}
          </Text>
          <Text style={styles.time} numberOfLines={1}>
            End Date
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.subContainer}
        onPress={props.direction}
      >
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={22}
          style={styles.iconContainer}
        />

        <View style={styles.eventDate}>
          <Text style={styles.venues} numberOfLines={1}>
            {props.Venues}
          </Text>
          <Text style={styles.time}>Event Address</Text>
        </View>
      </TouchableOpacity>

      <View
        style={styles.subContainer} // july 19 last edited area
      >
        <MaterialCommunityIcons
          name="ticket"
          size={22}
          style={styles.iconContainer}
        />

        <View style={styles.eventDate}>
          <Text style={styles.prices} numberOfLines={1}>
            {props.Price == null ? free : props.Price + currency}
          </Text>
          <Text style={styles.time}>Entrance fee</Text>
        </View>
      </View>

      {/* call button */}
      {props.phone && (
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.subContainer}
            onPress={() => MakeCall(props.phone)}
          >
            <FontAwesome5
              name="phone-alt"
              size={21}
              style={styles.iconContainer}
            />

            <View style={styles.eventDate}>
              <View>
                <Text style={styles.venues}>{props.phone}</Text>
              </View>

              <Text style={styles.time}>Contact Phone</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  topContent: {
    marginHorizontal: 10,
    paddingBottom: 10,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "94%",
  },
  iconContainer: {
    margin: 5,
    padding: 8,
    borderRadius: 25,
    color: Constants.primary,
  },
  eventDate: {
    marginLeft: 4,
  },
  phoneIcon: {
    backgroundColor: Constants.Faded,
    margin: 5,
    padding: 8,
    borderRadius: 25,
    color: Constants.Success,
  },
  venues: {
    marginLeft: 2,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
  },

  prices: {
    marginLeft: 2,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
  },
  date: {
    marginLeft: 2,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  time: {
    fontSize: 12,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
    marginLeft: 2,
  },
  happening: {
    marginLeft: 2,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  cancelled: {
    marginLeft: 2,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Secondary,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
});
export default DetailContent;
