//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import Constants from "../../constants/Constants";
import { MaterialCommunityIcons } from "react-native-vector-icons";

// create a component
const BoughtTicket = ({ iconName,iconColor, title, quantity, type, onPress }) => {
 


  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.IconContainer}>
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={iconColor}
          />
        </View>

        <View style={styles.txtcontent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.tickettype}>
            {quantity} {type} Ticket
          </Text>
        </View>

        <View style={styles.qrcodecontainer}>
          <Image
            style={styles.qrcode}
            source={require("../../assets/images/qrcode.png")}
          />
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    backgroundColor: Constants.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 6,
   
    marginVertical: 2,
    borderRadius: Constants.mediumbox,
  },
  IconContainer: {
    margin: 2,
    padding: 10,
    borderRadius: 26,
    backgroundColor: Constants.Faded,
  },
  txtcontent: {
    //text content container styles
  },
  title: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
    marginLeft: 12,
    textTransform: "capitalize",
  },
  tickettype: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
    marginLeft: 12,
    textTransform: "capitalize",
  },
  qrcodecontainer: {
    position: "absolute",
    right: 6,
    margin: 4,
    padding: 2,
    backgroundColor: Constants.Faded,
    borderRadius: 4,
  },
  qrcode: {
    width: 36,
    height: 36,
  },
});

//make this component available to the app
export default BoughtTicket;
