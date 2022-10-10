import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

import { Button, Paragraph, Title } from "react-native-paper";
import Constants from "../constants/Constants";

function Tickets({ navigation }) {
  const [ticket, setTicket] = React.useState(false);
  return (
    <View style={styles.container}>
      {ticket ? (
        <Text>Tickets Screen</Text>
      ) : (
        <View style={styles.noTicketContainer}>
          <Image
            source={require("../assets/noticket.png")}
            style={styles.noTicketImage}
            resizeMode="contain"
          />
          <Title style={styles.prompttxt}>You have no ticket Yet!</Title>
          <Paragraph>To buy ticket go to event listing</Paragraph>
          <TouchableOpacity
            //this is a button which redirect user to today event listing in the home page
            style={styles.eventsBtn}
            activeOpacity={0.7}
            onPress={()=>navigation.navigate("Home")}
          >
            <Text style={styles.eventstxt}>Events</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
  },
  noTicketContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  noTicketImage: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  prompttxt: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
  eventsBtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.primary,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventstxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
  },
});

export default Tickets;
