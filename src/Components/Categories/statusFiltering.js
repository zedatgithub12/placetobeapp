//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { Ionicons } from "react-native-vector-icons";

// status listing component

const Statuses = ({ category, check, background, color, border, onPress }) => {
  return (
    <View style={{ borderRadius: 10, overflow: "hidden" }}>
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: background,
              borderColor: border,
              overflow: "hidden",
            },
          ]}
        >
          <Text style={[styles.categoryText, { color: color }]}>
            {category}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    minWidth: 110,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 5,
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  categoryText: {
    fontWeight: "600",
  },
});

//make this component available to the app
export default Statuses;
