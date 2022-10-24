//import liraries
import React, { Component, useState } from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { Badge, Title } from "react-native-paper";
import Constants from "../constants/Constants";
import { Entypo } from "react-native-vector-icons";
// create a component

const Notice = ({
  organizerName,
  noticeTitle,
  date,
  time,
  onPressNotice,

}) => {
  const events= new Date();
  let year = events.getFullYear();
  let month = events.getMonth();
  let day = events.getDate();
   var currentMonth = month+1;
  var today = year+"-"+currentMonth+"-"+day;

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
            {organizerName} posted
          </Text>
          <Text numberOfLines={1} style={styles.eventNames}>
            {noticeTitle}
          </Text>
           
         
        </View>
        {date === today ? (
              <Text style={styles.noticeStatus}>New</Text>
            )
            :
            null
            }
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  containerBtn: {
    borderRadius: Constants.tiny,
  },
  noticeContainer: {
    flexDirection: "row",
    width: "96%",
    paddingHorizontal: 10,
    padding: 5,
    marginTop: 2,
    borderRadius: Constants.tinybox,
    alignSelf: "center",
    justifyContent: "flex-start",
    backgroundColor: Constants.background,
  },
  notbellContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Constants.transparentPrimary,
    borderRadius: 50,
  },
  contentContainer: {
    marginLeft: 10,
  },
  titleContainer: {
    flexDirection: "row",
  },
  noticeTitle: {
    width: "98%",
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
    margin: 2,
    textTransform: "capitalize"
  },
  eventNames: {
    width: "98%",
    margin: 2,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    color: Constants.primary,
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
  badge:{
    position:"absolute",
    top:10,
    right:10
  },
  noticeStatus:{
    color:Constants.lightPurple,
    fontWeight: Constants.Bold,
    fontStyle: "italic",
    backgroundColor: Constants.Faded,
    height:"45%",
    paddingHorizontal:10,
    borderRadius:Constants.borderRad
  }
});

//make this component available to the app
export default Notice;
