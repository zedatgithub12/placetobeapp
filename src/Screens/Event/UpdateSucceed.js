//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { Caption } from "react-native-paper";
import {
  // AntDesign,
  // Ionicons,
  // MaterialCommunityIcons,
  EvilIcons,
} from "react-native-vector-icons";
import Constants from "../../constants/Constants";

// create a component
const UpdateSucceed = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <EvilIcons
        name="check"
        size={120}
        color={Constants.green}
        style={styles.checkIcon}
      />
      <Text style={styles.succeedText}>Successfully Updated!</Text>
      <Caption style={styles.helper}>To review update </Caption>
      <TouchableNativeFeedback
        onPress={() => navigation.navigate("yourEvents")}
      >
        <View style={styles.ticketsbtn}>
          <Text style={styles.ticketsText}>Your Events</Text>
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
    marginTop: 100,
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
    
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.Faded,
    margin: 20,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketsText: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Boldtwo,
    color: Constants.purple,
  },
});

//make this component available to the app
export default UpdateSucceed;
