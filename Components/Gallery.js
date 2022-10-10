import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Constants from "../constants/Constants";

const Images = ({ title, picture, description, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.EventContainer}
      onPress={onPress}
    >
      <Image
        source={picture}
        style={styles.FeaturedImagestyle}
        resizeMode="cover"
        resizeMethod="auto"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  EventContainer: {
    flex: 1,
    height: 110,
    margin: 1,
  
  },
  FeaturedImagestyle: {
    width: "100%",
    height: "100%",
    borderRadius:2,
  },
});
export default Images;
