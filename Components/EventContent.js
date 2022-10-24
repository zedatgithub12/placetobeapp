import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Caption, HelperText } from "react-native-paper";
import { MaterialCommunityIcons, FontAwesome } from "react-native-vector-icons";
import Constants from "../constants/Constants";

const DetailContent = ({ ...props }) => {
  const free = "Free";
  const currency = " ETB";

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
          <Text style={styles.time}>
            {props.StartDate} ({props.StartTime}) - {props.EndDate} (
            {props.EndTime})
          </Text>
        </View>
      </View>

      <View
        style={styles.subContainer} // july 19 last edited area
      >
        <MaterialCommunityIcons
          name="ticket"
          size={22}
          style={styles.iconContainer}
        />

        <View
         // style={styles.priceContainer}
          // Event price detail
        >
          
          <Text style={styles.prices}>{props.Price == 0 ? free  : props.Price+currency } </Text>
          <Text style={styles.time}>Entrance fee</Text>
        </View>
      </View>

      <View style={styles.subContainer}>
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={22}
          style={styles.iconContainer}
        />
        <View style={styles.eventDate}>
       
          <Text style={styles.venues}>{props.Venues}</Text>
          <Text style={styles.time}>Event Address</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  topContent: {
    marginHorizontal: 20,
    paddingBottom:10,
    borderBottomWidth:1,
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
    color:Constants.primary
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
  date:{
    marginLeft: 2,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },
  time:{
    fontSize:12,
    fontWeight: Constants.Boldtwo,
    color:Constants.Secondary,
  }
});
export default DetailContent;
