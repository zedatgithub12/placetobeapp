//import liraries
import React from "react";
import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

// create a component
const Loader = ({ size, color }) => {
  const { theme } = useTheme();
  const kelem = color ? color : theme.dark.main;
  const indicator =
    size == "large" ? (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={kelem} />
      </View>
    ) : (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={kelem} />
      </View>
    );

  return indicator;
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
});

//make this component available to the app
export default Loader;
