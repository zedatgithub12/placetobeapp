//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Constants from "../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
import call from "react-native-phone-call";
import * as Linking from "expo-linking";

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
    <View style={styles.container}>
      <View style={styles.logobackground}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.p2bLogo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.description}>
        p2b-Ethiopia integrated a self-service components needed to seamlessly
        plan, promote and produce live events, while reducing friction and
        costs, increasing reach and driving ticket sales, among others.
      </Text>

      <Text style={styles.contactTitle}>Contact us</Text>
      <View style={styles.phoneContainer}>
        <Pressable
          onPress={() => MakeCall("+251949390840")}
          style={styles.phone}
        >
          <Ionicons
            name="call"
            size={20}
            color={Constants.primary}
            style={styles.callIcon}
          />
          <Text>+251949390840</Text>
        </Pressable>
        <Pressable
          onPress={() => MakeCall("+251911314175")}
          style={styles.phone}
        >
          <Ionicons
            name="call"
            size={20}
            color={Constants.primary}
            style={styles.callIcon}
          />
          <Text>+251911314175</Text>
        </Pressable>
      </View>

      <View style={styles.email}>
        <Ionicons
          name="mail"
          size={20}
          color={Constants.primary}
          style={styles.callIcon}
        />
        <Text>contact@p2b-ethiopia.com</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text>Beta Version</Text>
        <View style={styles.developer}>
          <Text>Developed By </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://afromina-digitals.com/")}
          >
            <Text style={styles.afromina}>AfroMiNA Digitals</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    backgroundColor: Constants.background,
  },
  logobackground: {
    backgroundColor: Constants.background,
    borderRadius: Constants.borderRad,
    marginTop: 30,
  },
  p2bLogo: {
    width: 180,
    height: 180,
  },

  description: {
    width: "85%",
    alignSelf: "center",
    padding: 10,
    textTransform: "capitalize",
    textAlign: "center",
    lineHeight: 18,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    color: Constants.Secondary,
  },
  contactTitle: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.Secondary,
    paddingTop: 20,
  },
  phoneContainer: {
    flexDirection: "row",
    padding: 10,
    marginTop: 10,
  },
  phone: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.Faded,
    marginHorizontal: 10,
    padding: 5,
    paddingRight: 20,
    borderRadius: Constants.medium,
  },
  callIcon: {
    // backgroundColor: Constants.background,
    padding: 8,
    borderRadius: Constants.tiny,
    marginRight: 5,
  },
  email: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    //  backgroundColor: Constants.Faded,
    marginHorizontal: 5,
    padding: 5,
    borderRadius: Constants.medium,
  },
  bottomSection: {
    position: "absolute",
    bottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  developer: {
    flexDirection: "row",
    marginTop: 10,
  },
  afromina: {
    color: Constants.primaryTwo,
    fontWeight: Constants.Boldtwo,
    textDecorationLine: "underline",
  },
});

//make this component available to the app
export default About;
