//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { Caption } from "react-native-paper";
import { EvilIcons } from "react-native-vector-icons";
import Constants from "../../constants/Constants";

// create a component
const AddingTicketSucceed = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <EvilIcons
        name="check"
        size={120}
        color={Constants.green}
        style={styles.checkIcon}
      />
      <Text style={styles.succeedText}>Successfully Added Ticket!</Text>
      <Caption style={styles.helper}>Follow up ticket sales progress</Caption>
      <TouchableNativeFeedback
        onPress={() => navigation.navigate("My Tickets")}
      >
        <View style={styles.ticketsbtn}>
          <Text style={styles.ticketsText}>Your Tickets</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Constants.background,
  },
  checkIcon: {
    marginTop: 60,
    marginBottom: 20,
  },
  succeedText: {
    fontWeight: Constants.Bold,
    fontSize: Constants.primaryHeading,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
    marginBottom: 4,
  },
  ticketsbtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.primary,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketsText: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
});

//make this component available to the app
export default AddingTicketSucceed;
