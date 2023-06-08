//import liraries
import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Title, Paragraph } from "react-native-paper";
import Constants from "../../constants/Constants";

/****************************** No Ticket Handler Component ************************ */

const NoTicket = ({ ...props }) => {
  return (
    <View style={styles.noTicketContainer}>
      <Image
        source={require("../../assets/images/noticket.png")}
        style={styles.noTicketImage}
        resizeMode="contain"
      />
      <Title style={styles.prompttxt}>{props.title}</Title>
      <Paragraph>{props.helperText}</Paragraph>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  noTicketContainer: {
    flex: 1,
    width: "80%",
    height: Dimensions.get("screen").height/1.6,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  noTicketImage: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  prompttxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
});

//make this component available to the app
export default NoTicket;
