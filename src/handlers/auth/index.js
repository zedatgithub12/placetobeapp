//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "react-native-vector-icons";
import { Paragraph, Title } from "react-native-paper";
import Constants from "../../constants/Constants";

/**************************** User not Logged in handler ************************ */
const NotLoggedIn = ({ ...props }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.notLogedPrompt}>
        <FontAwesome5
          name="info-circle"
          size={66}
          color={Constants.primary}
          style={{ marginTop: -50 }}
        />

        <Title style={styles.prompttxt}>Please sign in first</Title>
        <Paragraph style={styles.helperText}>{props.helpertext}</Paragraph>

        <View style={styles.actionBtns}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.createAccountBtn}
            onPress={props.signUp}
          >
            <Text style={styles.btnTxt}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={props.signIn}
            activeOpacity={0.7}
            style={styles.LoginBtn}
          >
            <Text style={styles.loginbtnTxt}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  notLogedPrompt: {
    height: 270,
    width: 300,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Constants.background,
    borderRadius: Constants.borderRad,
    elevation: 6,
    padding: 15,
    shadowColor: Constants.transparentPrimary,
  },
  prompttxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    marginTop: 10,
    color: Constants.Inverse,
  },
  helperText: {
    width: "90%",
    textAlign: "center",
    marginTop: 10,
    color: Constants.Secondary,
  },
  actionBtns: {
    position: "absolute",
    bottom: 25,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createAccountBtn: {
    width: "50%",
    backgroundColor: Constants.background,
    borderRadius: Constants.tiny,
    padding: 10,
    alignItems: "center",
  },
  LoginBtn: {
    width: "38%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    padding: 6,
  },
  btnTxt: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
  },
  loginbtnTxt: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
});

//make this component available to the app
export default NotLoggedIn;
