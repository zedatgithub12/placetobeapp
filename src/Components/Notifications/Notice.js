//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import Constants from "../../constants/Constants";
import { Entypo } from "react-native-vector-icons";
import { Dimensions } from "react-native";
import { Divider } from "react-native-paper";
// create a component

const Notice = ({ noticeTitle, about, date, time, onPressNotice }) => {
  const events = new Date();
  let year = events.getFullYear();
  let month = events.getMonth();
  let day = events.getDate();
  var currentMonth = month + 1;
  var today = year + "-" + currentMonth + "-" + day;

  return (
    <TouchableNativeFeedback
      onPress={onPressNotice}
      style={styles.containerBtn}
    >
      <View style={styles.noticeContainer}>
        <View style={styles.notbellContainer}>
          <Entypo name="bell" size={20} color={Constants.primary} />
        </View>

        <View style={styles.contentContainer}>
          <Text numberOfLines={1} style={styles.noticeTitle}>
            {noticeTitle}
          </Text>

          <Text numberOfLines={1} style={styles.contents}>
            {about}
          </Text>

          <Text numberOfLines={1} style={styles.noticeTimestamp}>
            {time}
          </Text>
        </View>
        {date == today && <Text style={styles.noticeStatus}>New</Text>}
        <Divider />
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  containerBtn: {
    borderRadius: Constants.tiny,
    padding: 6,
  },
  noticeContainer: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 2,
    borderRadius: Constants.tinybox,
    backgroundColor: Constants.background,
  },
  notbellContainer: {
    width: 40,
    height: 40,
    marginTop: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.Faded,
    borderRadius: 50,
  },
  contentContainer: {
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: "row",
  },
  noticeTitle: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
    margin: 2,
  },
  contents: {
    margin: 2,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.textSize,
    color: Constants.Secondary,
  },
  noticeTimestamp: {
    margin: 3,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
  },
  helperInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  noticeStatus: {
    color: Constants.lightPurple,
    fontWeight: Constants.Bold,
    fontStyle: "italic",
    backgroundColor: Constants.Faded,
    height: "45%",
    paddingHorizontal: 10,
    borderRadius: Constants.borderRad,
  },
});

//make this component available to the app
export default Notice;
