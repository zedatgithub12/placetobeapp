//import liraries
import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Title, Paragraph } from "react-native-paper";
import Constants from "../../constants/Constants";

/****************************** No Ticket Handler Component ************************ */

const NotFound = ({ ...props }) => {
  return (
    <View style={styles.noTicketContainer}>
      <View style={{ width: 260, height: 260 }}>
        <Image
          source={props.image}
          style={styles.noTicketImage}
          resizeMode="contain"
        />
      </View>

      <Title style={styles.prompttxt}>{props.title}</Title>
      <Paragraph>{props.helperText}</Paragraph>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  noTicketContainer: {
    width: "80%",
    height: Dimensions.get("screen").height / 1.9,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  noTicketImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    aspectRatio: 1,
    resizeMode: "cover",
  },
  prompttxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,

    color: Constants.Inverse,
  },
});

//make this component available to the app
export default NotFound;
