//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Constants from "../constants/Constants";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import SvgQRCode from 'react-native-qrcode-svg';

// create a component
const BoughtTicket = ({icon, title, quantity, type}) => {
    function Simple() {
        return <SvgQRCode value="http://example.com" />;
      }
      
      // 20% (default) sized logo from local file string with white logo backdrop
    //   function LogoFromFile() {
    //     let logoFromFile = require('../assets/logo.png');
      
    //     return <SvgQRCode value="Just some string value" logo={logoFromFile} />;
    //   }
      
  return (
    <View style={styles.container}>
      <View style={styles.IconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={Constants.PrimaryBlue}
        />
      </View>

      <View style={styles.txtcontent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.tickettype}>{quantity} * {type}</Text>
      </View>

      <View style={styles.qrcodecontainer}>
        <Text>QR IMAGE</Text>
      </View>

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Simple />
        {/* The logo doesn't display on Expo Web */}
        {/* <LogoFromFile /> */}
      </View>
      
    </View>
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
    marginVertical:1,
    borderRadius: Constants.mediumbox,
  },
  IconContainer:{
      margin:2,
      padding:10,
      borderRadius:26,
      backgroundColor: Constants.Faded,
  },
  txtcontent:{
      //text content container styles
  },
  title:{
   fontSize: Constants.headingtwo,
   fontWeight:Constants.Bold,
   fontFamily: Constants.fontFam,
   color: Constants.Inverse,
   marginLeft:12
  },
  tickettype:{
    fontSize: Constants.headingthree,
    fontWeight:Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
    marginLeft:12
  },
  qrcodecontainer:{
      position:"absolute",
      right:4,
      margin:4,
      padding:2
  }
});

//make this component available to the app
export default BoughtTicket;
