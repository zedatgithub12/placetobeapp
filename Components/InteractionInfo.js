import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Constants from "../constants/Constants";

const userInfo = ({ ...props }) => {
  return (
    <View
      //view container for user  information like
      //followers ,following, event posted
      style={styles.infoContainer}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.containerWithIcon}
        onPress={props.getData}
      >
        <Text style={styles.txts}>{props.Events}</Text>
        <Text style={styles.describingtxt}>Events</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.containerWithIcon}
        onPress={props.followerCountPressed}
      >
        <Text style={styles.txts}>{props.Followers}</Text>
        <Text style={styles.describingtxt}>Followers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.containerWithIcon}
        onPress={props.followingCountPressed}
        activeOpacity={0.8}
      >
        <Text style={styles.txts}>{props.Following}</Text>
        <Text style={styles.describingtxt}>Following</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  containerWithIcon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,

    padding: 5,
    borderRadius: Constants.mediumbox,
    width: "30%",

  },

  describingtxt: {
    color: Constants.Secondary,
    fontWeight: Constants.Bold,
  },
  txts: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
  },
});

export default userInfo;
