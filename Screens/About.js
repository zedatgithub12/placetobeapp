//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Constants from "../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
import call from "react-native-phone-call";
import * as Linking from "expo-linking";

import { Caption } from "react-native-paper";

// create a component
const About = () => {
  //make call to organizer
  const MakeCall = (phone) => {
    const args = {
      number: phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logobackground}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.p2bLogo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.description}>
        Event promoter and event-related information provider by leveraging
        world-class technologies.
      </Text>

      <Text style={styles.contactTitle}>Contact us</Text>
      <View style={styles.phoneContainer}>
        <Pressable
          onPress={() => MakeCall("+251949390840")}
          style={styles.phone}
        >
          <View style={styles.phoneIcon}>
            <Ionicons
              name="call"
              size={20}
              color={Constants.Success}
              style={styles.callIcon}
            />
          </View>
          <Text style={{ fontFamily: Constants.fontFam, marginLeft: 10, }}>+251949390840</Text>
        </Pressable>
        <Pressable
          onPress={() => MakeCall("+251911314175")}
          style={styles.phone}
        >
          <View style={styles.phoneIcon}>
            <Ionicons
              name="call"
              size={20}
              color={Constants.Success}
              style={styles.callIcon}
            />
          </View>
          <Text style={{ fontFamily: Constants.fontFam, marginLeft: 10 }}>+251911287645</Text>
        </Pressable>
      </View>

      <View style={styles.email}>
        <View style={styles.emailIcon}>
          <Ionicons
            name="mail"
            size={22}
            color={Constants.lightPurple}
            style={styles.callIcon}
          />
        </View>
        <Text style={{ fontFamily: Constants.fontFam, marginLeft: 10 }}>
          contact@p2b-ethiopia.com
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Caption>Version 1.0.0</Caption>
        <View style={styles.developer}>
          <Text style={styles.developedBy}>Powered By: </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://afromina-digitals.com/")}
          >
            <Text style={styles.afromina}>
              AfroMiNA Digital Technologies PLC
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
 
    alignItems: "center",
   
  },
  logobackground: {
    backgroundColor: Constants.background,
    borderRadius: Constants.borderRad,
    marginTop: 18,
  },
  p2bLogo: {
    width: 160,
    height: 160,
  
  },

  description: {
    width: "86%",
    alignSelf: "center",
    padding: 8,
    textAlign: "center",
    lineHeight: 18,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    color: Constants.Secondary,
    marginTop:22,
  },
  contactTitle: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.purple,
    paddingTop: 15,
    
  },
  phoneContainer: {
    width: "90%",
    flexDirection: "column",
    padding: 10,
    marginTop: 3,
  },
  phone: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    padding: 5,
    paddingRight: 20,
  },
  callIcon: {
    // backgroundColor: Constants.background,
    padding: 6,
    borderRadius: Constants.tiny,
    
  },
  email: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  emailIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
 
    borderWidth: 0.5,
    borderColor: Constants.lightPurple
  },
  phoneIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,

    borderWidth: 0.5,
    borderColor: Constants.Success
  },

  bottomSection: {
    marginTop: 50,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  developer: {
    flexDirection: "row",
    marginTop: 10,
  },
  developedBy: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
  },
  afromina: {
    color: "#1264A4",
    fontWeight: Constants.Boldtwo,
    textDecorationLine: "underline",
  },
});

//make this component available to the app
export default About;
