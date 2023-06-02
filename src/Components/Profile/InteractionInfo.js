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
          activeOpacity={0.8}
          style={{ alignItems: "center" }}
          onPress={props.getData}
        >
          <Text style={styles.txts}>{props.Events}</Text>
          <Text style={styles.describingtxt}>Your Events</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerWithIcon}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: "center" }}
          onPress={props.followerCountPressed}
        >
          <Text style={styles.txts}>{props.Followers}</Text>
          <Text style={styles.describingtxt}>Followers</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerWithIcon}>
        <TouchableOpacity
          style={{ alignItems: "center" }}
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  containerWithIcon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    elevation: 3,
    shadowColor: Constants.Secondary,
    borderRadius: Constants.tinybox,
    width: "30%",
    backgroundColor: Constants.background,

  },
  describingtxt: {
    color: Constants.Secondary,
    fontFamily:Constants.fontFam,
    //fontWeight: Constants.Boldtwo,
  },
  txts: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.purple,
  },
});

export default userInfo;
