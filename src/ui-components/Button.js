//import liraries
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import Constants from "../constants/Constants";

// create a component
export const P2bAnimatedBtn = ({ title, animation, onPress }) => {
  return (
    <Animatable.View animation={animation} style={[styles.BtnContainer]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.btn}
      >
        <Text style={styles.btntxt}> {title}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

// define your styles
const styles = StyleSheet.create({
  BtnContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",

    padding: 6,
  },
  btn: {
    marginVertical: 6,
    alignSelf: "center",
    backgroundColor: Constants.primary,
    padding: 12,
    paddingHorizontal: 26,
    borderRadius: 8,
    justifyContent: "center",
    textAlign: "center",
    width: "94%",
  },
  btntxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    textAlign: "center",
    color: Constants.textColor,
  },
});