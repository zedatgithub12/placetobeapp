//import liraries
import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Constants from "../../constants/Constants";
import { MaterialCommunityIcons, Ionicons } from "react-native-vector-icons";
import { Caption } from "react-native-paper";
import Connection from "../../constants/connection";
import { useTheme } from "@react-navigation/native";

// create a component
const ForgotPass = ({ navigation }) => {
  const { theme } = useTheme();
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
      setErrorMessage("Please enter your email address");
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
          if (response.success) {
            setSucceed(true);
            setSubmit(false);
            setError(false);
            console.log(response.message);
          } else {
            setErrorMessage(response.message);
            setSubmit(false);
            setError(true);
            setSucceed(false);
          }
        })
        .catch((error) => {
          setSucceed(false);
        });
    }
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.main }]}
    >
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
        source={require("../../assets/images/passwords.png")}
        style={styles.forgotPass}
      />

      <Text style={styles.title}>Forgot Password</Text>
      <Caption style={styles.caption}>
        Enter email address associated with your account
      </Caption>

      <TextInput
        placeholder="Email address"
        style={styles.emailField}
        value={email}
        onChangeText={(val) => sendEmail(val)}
      />

      <TouchableOpacity
        onPress={() => ResetPassword()}
        activeOpacity={0.7}
        style={styles.sendBtn}
      >
        {submit ? (
          <ActivityIndicator size="small" color={Constants.Inverse} />
        ) : (
          <Text style={styles.sendButton}>Send</Text>
        )}
      </TouchableOpacity>
      {error ? (
        <Text style={styles.errorPrompt}>{errorMessage}</Text>
      ) : (
        <Text style={styles.errorPlaceHolder}></Text>
      )}
      {succeed && (
        <View style={styles.successContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={28}
            color={Constants.Success}
            style={{ paddingHorizontal: 4, marginRight: 8, marginTop: 4 }}
          />
          <Text style={styles.successText}>
            Successfully sent reset link to email address, open your email and
            set new password!
          </Text>
        </View>
      )}
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
    left: 0,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    height: 40,
    width: 40,
  },
  forgotPass: {
    marginTop: 120,
    marginBottom: 20,
    width: 200,
    height: 100,
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
    padding: 10,
    backgroundColor: Constants.Faded,
    width: "84%",
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
    width: Dimensions.get("screen").width / 1.2,
    marginTop: 18,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: Constants.tiny,
  },
  successContainer: {
    backgroundColor: Constants.lightGreen,
    flexDirection: "row",
    width: "84%",
    marginTop: 0,
    borderRadius: Constants.medium,
    borderColor: Constants.Success,
    padding: 8,
  },
  successText: {
    color: Constants.Inverse,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    width: "84%",
  },
  sendButton: {
    color: Constants.Inverse,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },
  errorPrompt: {
    marginVertical: 15,
    width: "84%",
    padding: 4,
    borderRadius: Constants.tiny,
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
