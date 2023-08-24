import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Constants from "../../constants/Constants";
import { LinearGradient } from "expo-linear-gradient";
const userInfo = ({ ...props }) => {
  return (
    <View
      //view container for user  information like
      //followers ,following, event posted
      style={styles.infoContainer}
    >
      <View style={styles.containerWithIcon}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
          onPress={props.followingCountPressed}
          activeOpacity={0.8}
        >
          <Text style={styles.txts}>{props.Following}</Text>
          <Text style={styles.describingtxt}>Following</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  containerWithIcon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  txts: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
    fontFamily: Constants.fontFam,
    marginHorizontal: 4,
  },
  describingtxt: {
    color: Constants.Inverse,
    fontFamily: Constants.fontFam,
    //fontWeight: Constants.Boldtwo,
  },
});

export default userInfo;
