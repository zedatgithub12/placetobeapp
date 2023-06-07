//import liraries
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Constants from "../../../../constants/Constants";

/************************************ UpcomingEvents ********************************** */
const UpcomingEvents = ({ ...props }) => {
  return (
    <TouchableRipple
      onPress={props.onPress}
      rippleColor={Constants.transparentPrimary}
      rippleBorderless={true}
      rippleRadius={50}
    >
      <View style={styles.container}>
        <View style={styles.eventContent}>
          <Text numberOfLines={1} style={styles.title}>
            {props.event_name}
          </Text>
          <Text style={styles.startdate}>{props.start_date}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: Constants.tinybox,
    margin: 2,
    padding: 8,
    paddingHorizontal: 10,
    backgroundColor: Constants.background,
  },
  eventContent: {
    width: "60%",
    marginRight: 10,
  },
  title: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
  },
  startdate: {
    color: Constants.Secondary,
    fontWeight: Constants.Boldtwo,
  },
});

//make this component available to the app
export default UpcomingEvents;
