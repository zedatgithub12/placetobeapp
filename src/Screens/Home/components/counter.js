//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Preferences from "../../../preferences";
import Constants from "../../../constants/Constants";
import { useTheme } from "@react-navigation/native";

// event listing footer component for homepage
const EventCounter = ({ events, onPress }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.primary.light,
          marginHorizontal: 5,
          borderBottomLeftRadius: 12,
          borderBottomLeftRadius: 12,
        },
      ]}
    >
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
