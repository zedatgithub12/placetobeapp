import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { Caption, HelperText } from "react-native-paper";
import {
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
} from "react-native-vector-icons";
import Constants from "../constants/Constants";
import call from "react-native-phone-call";
import * as Linking from "expo-linking";

const DetailContent = ({ ...props }) => {
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

  var location = props.Venues;
  var replacedSpaces = location.split(" ").join("+");

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
          <Text style={styles.date}>Happening Date</Text>
          <Text style={styles.time} numberOfLines={1}>
            {props.StartDate} ({props.StartTime}) - {props.EndDate} (
            {props.EndTime})
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.subContainer}
        onPress={() =>
          Linking.openURL(
            "https://www.google.com/maps/search/?api=1&query=" + replacedSpaces
          )
        }
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

        <View
          style={styles.eventDate}
          // Event price detail
        >
          <Text style={styles.prices} numberOfLines={1}>
            {props.Price == 0 ? free : props.Price + currency}
          </Text>
          <Text style={styles.time}>Entrance fee</Text>
        </View>
      </View>

      {/* call button */}
      {props.phone == 0 ? null : (
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
    marginHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.icon,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: Constants.iconBack,
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
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },

  prices: {
    marginLeft: 2,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },
  date: {
    marginLeft: 2,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },
  time: {
    fontSize: 12,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
  },
});
export default DetailContent;
