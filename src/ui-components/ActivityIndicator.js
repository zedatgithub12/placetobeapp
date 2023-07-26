//import liraries
import React from "react";
import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

// create a component
const Loader = (size) => {
  const { theme } = useTheme();

  const indicator =
    size == "large" ? (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.dark.main} />
      </View>
    ) : (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.dark.main} />
      </View>
    );

  return indicator;
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical:30
  },
});

//make this component available to the app
export default Loader;
