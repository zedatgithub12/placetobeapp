import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Title, Paragraph } from "react-native-paper";
import Constants from "../../constants/Constants";

// create a failed to fetch component
const FailedToFetch = ({ ...props }) => {
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
      <TouchableOpacity onPress={props.onPress} style={styles.eventsBtn}>
        <Text style={styles.eventstxt}>Reload</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  noTicketContainer: {
    width: "80%",
    height: Dimensions.get("screen").height / 1.4,
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
  eventsBtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventstxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.primary,
  },
});

//make this component available to the app
export default FailedToFetch;
