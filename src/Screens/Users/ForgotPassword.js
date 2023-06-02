//import liraries
import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Constants from "../../constants/Constants";
import { MaterialCommunityIcons, Ionicons } from "react-native-vector-icons";
import { ActivityIndicator, Caption } from "react-native-paper";
import Connection from "../../constants/connection";

// create a component
const ForgotPass = ({ navigation }) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [submit, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [succeed, setSucceed] = useState(false);

  const sendEmail = (val) => {
    setEmail(val);
  };

  const ResetPassword = () => {
    if (email == 0) {
      setError(true);
      setErrorMessage(
        "Please enter you email address or username associated with your account"
      );
      setSubmit(false);
    } else {
      setSubmit(true);
      var ApiUrl = Connection.url + Connection.forgotPassword;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      var Data = {
        email: email,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          var message = response[0].message;
          if (message === "succeed") {
            setSucceed(true);
            setSubmit(false);
            setError(false);
          } else {
            setErrorMessage(message);
            setSubmit(false);
            setError(true);
          }
        });
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backArrow} // back arrow button style
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-sharp"
          size={25}
          //back arrow icon
        />
      </TouchableOpacity>
      <Image
        source={require("../../assets/images/forget.png")}
        style={styles.forgotPass}
      />

      <Text style={styles.title}>Reset Password</Text>
      <Caption style={styles.caption}>
        Enter your email address or username associated with your account in the
        field below
      </Caption>

      <TextInput
        placeholder="Email or Username"
        style={styles.emailField}
        value={email}
        onChangeText={(val) => sendEmail(val)}
      />
      {error ? (
        <Text style={styles.errorPrompt}>{errorMessage}</Text>
      ) : (
        <Text style={styles.errorPlaceHolder}></Text>
      )}

      <TouchableOpacity
        onPress={() => ResetPassword()}
        activeOpacity={0.7}
        style={styles.sendBtn}
      >
        {submit ? (
          <ActivityIndicator size="small" color={Constants.background} />
        ) : (
          <Text style={styles.sendButton}>Send</Text>
        )}
      </TouchableOpacity>

      {succeed ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Successfully sent reset link to email address associated with your
            account open your email and set new password!
          </Text>
          <MaterialCommunityIcons
            name="check-circle"
            size={32}
            color={Constants.background}
            style={{ paddingHorizontal: 20 }}
          />
        </View>
      ) : null}
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
  backArrow: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: Constants.background,
    height: 40,
    width: 40,
    borderRadius: 50,
    elevation: 2,
  },
  forgotPass: {
    marginTop: 80,
    width: 280,
    height: 180,
  },
  title: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    marginTop: 20,
    color: Constants.Inverse,
  },
  caption: {
    width: "75%",
    marginTop: 5,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    color: Constants.Secondary,
    textAlign: "center",
  },
  emailField: {
    padding: 8,
    backgroundColor: Constants.Faded,
    width: "80%",
    borderRadius: Constants.medium,
    marginTop: 20,
    paddingLeft: 25,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    borderWidth: 1,
    borderColor: Constants.primary,
  },
  sendBtn: {
    backgroundColor: Constants.primary,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: Constants.tiny,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginTop: 40,
    backgroundColor: Constants.Success,
    borderRadius: Constants.medium,
    padding: 20,
  },
  successText: {
    color: Constants.background,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    width: "87%",
  },
  sendButton: {
    color: Constants.Inverse,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },
  errorPrompt: {
    backgroundColor: Constants.lightRed,
    marginVertical: 15,
    width: "70%",
    padding: 4,
    borderRadius: Constants.tiny,
    paddingHorizontal: 20,
    color: Constants.Danger,
  },
  errorPlaceHolder: {
    marginVertical: 5,
    width: "70%",
    padding: 4,
    borderRadius: Constants.tiny,
    paddingHorizontal: 20,
  },
});

//make this component available to the app
export default ForgotPass;
