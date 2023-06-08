//import liraries
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Caption } from "react-native-paper";
import Constants from "../../constants/Constants";

/************************ No Connection Handler ********************** */
const NoConnection = ({ ...props }) => {
  return (
    <View style={styles.noConnection}>
      <Image
        source={require("../../assets/images/connect.png")}
        style={styles.connImage}
        resizeMode="contain"
      />

      <Text>No Connection</Text>
      <Caption>Please Check your internet connection</Caption>
      <TouchableOpacity onPress={props.onPress} style={styles.eventsBtn}>
        <Text style={styles.eventstxt}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  noConnection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  connImage: {
    height: "50%",
    width: "90%",
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
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.background,
  },
  icon: {
    width: 80,
    height: 80,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default NoConnection;
