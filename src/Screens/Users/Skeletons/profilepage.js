//import liraries
import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Constants from "../../../constants/Constants";

const ProfileShimmer = () => {
  const { theme } = useTheme();
  return (
    <SkeletonPlaceholder>
      <View style={{ height: 200 }}></View>

      <View style={{ width: "100%", marginLeft: 13, marginVertical: 15 }}>
        <View
          style={{
            marginLeft: 3,
            marginTop: 16,
            width: "92%",
            height: 30,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            marginLeft: 3,
            marginTop: 16,
            width: "92%",
            height: 30,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            marginLeft: 3,
            marginTop: 16,
            width: "92%",
            height: 30,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            marginLeft: 3,
            marginTop: 16,
            width: "92%",
            height: 30,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            marginLeft: 3,
            marginTop: 16,
            width: "92%",
            height: 30,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            marginLeft: 3,
            marginTop: 16,
            width: "92%",
            height: 30,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            marginLeft: 3,
            marginTop: 16,
            width: "32%",
            height: 30,
            borderRadius: 3,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  profilePicker: {
    top: -45,
    backgroundColor: Constants.Faded,
    width: 88,
    height: 88,
    alignSelf: "center",
    borderRadius: 43,
    padding: 3.8,
    elevation: 2,
    shadowColor: Constants.Secondary,
  },
  txtContent: {
    top: -55,
    marginTop: 5,
    margin: 4,
    padding: 5,
  },
  profileImage: {
    backgroundColor: Constants.Faded,
  },
  badgeStyle: {
    alignSelf: "center",
    color: Constants.background,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
    marginLeft: 15,
  },
  userNameShimmer: {
    top: -48,
    margin: 15,
    padding: 10,
    alignSelf: "center",
  },
  userEmailshimmer: {
    top: -68,
    margin: 15,
    padding: 8,
    alignSelf: "center",
  },
});
//make this component available to the app
export default ProfileShimmer;
