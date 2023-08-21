//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { Ionicons } from "react-native-vector-icons";

// status listing component

const Statuses = ({ category, check, background, color, border, onPress }) => {
  return (
    <TouchableNativeFeedback
      activeOpacity={0.8}
      onPress={onPress}
      style={{ borderRadius: 6 }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: background, borderColor: border },
        ]}
      >
        <Text style={[styles.categoryText, { color: color }]}>{category}</Text>
        {check && <Ionicons name="checkmark-circle" size={14} color="#fff" />}
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    minWidth: 110,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
