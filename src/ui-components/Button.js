//import liraries
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Constants from "../constants/Constants";
import Loader from "./ActivityIndicator";

// create a component
export const P2bAnimatedBtn = ({
  title,
  isSubmitting,
  animation,
  duration,
  onPress,
}) => {
  return (
    <Animatable.View
      animation={animation}
      duration={duration ? duration : null}
      style={[styles.BtnContainer]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.btn}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={Constants.Inverse} />
        ) : (
          <Text style={styles.btntxt}> {title}</Text>
        )}
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
