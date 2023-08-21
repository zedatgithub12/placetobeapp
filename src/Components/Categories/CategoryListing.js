//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

// category listing component

const Categories = ({ category, icon, background, color, border, onPress }) => {
  return (
    <TouchableNativeFeedback activeOpacity={0.8} onPress={onPress}>
      <View
        style={[
          styles.container,
          { backgroundColor: background, borderColor: border },
        ]}
      >
        {icon && <MaterialCommunityIcons name={icon} size={22} color={color} />}

        <Text style={[styles.categoryText, { color: color }]}>{category}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 5,
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  categoryText: {
    fontWeight: "600",
  },
});

//make this component available to the app
export default Categories;
