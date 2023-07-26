//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Preferences from "../../../preferences";
import Constants from "../../../constants/Constants";

// create a component
const EventCounter = ({ events, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.btn}
        onPress={onPress}
      >
        <View>
          <Text style={{ fontSize: Constants.textSize, paddingRight: 8 }}>
            {Preferences.listedEvent} of {events.length}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  btn: {
    padding: 4,
  },
});

//make this component available to the app
export default EventCounter;
