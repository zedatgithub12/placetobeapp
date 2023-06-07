//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import Constants from "../../../../constants/Constants";
// create a component
const Header = ({ ...props }) => {
  return (
    <View style={styles.container}>
      <View style={styles.activeTickets}>
        <Text style={{ fontSize: 28 }}> {props.activeTickets} </Text>
        <Text> Active Tickets </Text>
      </View>
      <TouchableNativeFeedback onPress={props.addTicket}>
        <View style={styles.addTicket}>
          <Text style={{ fontSize: 28 }}>+ </Text>
          <Text>Create Ticket</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    margin: 10,
    padding: 10,
    paddingVertical: 20,
    borderRadius: 8,
  },
  activeTickets: {
    width: "44%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 11,
    backgroundColor: Constants.lightGreen,
    paddingHorizontal: 20,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderRightWidth: 1,
    borderColor: Constants.background,
  },
  addTicket: {
    width: "44%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 11,
    backgroundColor: Constants.iconBack,
    paddingHorizontal: 20,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
});

//make this component available to the app
export default Header;
