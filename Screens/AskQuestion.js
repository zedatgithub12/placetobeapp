import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Constants from "../constants/Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../constants/connection";
import {
  MaterialIcons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { ActivityIndicator } from "react-native-paper";
import * as Linking from "expo-linking";

const Questions = () => {
  const [name, setName] = useState(); // user first and middle name
  const [email, setEmail] = useState(); //user email address
  const [phone, setPhone] = useState(); // user phone number
  const [message, setMessage] = useState(""); // comment box state
  const [loader, setLoader] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    text: "",
    textColor: Constants.Danger,
    background: Constants.Faded,
    show: false,
    Icon: false,
  });

  //get user information from database
  const getUserInfo = async () => {
    var userId = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.MetaData;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var data = {
      userId: userId,
    };
    //save user info into database
    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        var resp = response[0];

        if (resp.message === "succeed") {
          var userInfo = response[0].user[0];
          setName(userInfo.first_name + " " + userInfo.middle_name);
          setEmail(userInfo.email);
          setPhone(userInfo.phone);
        } else {
        }
      });
    return () => {};
  };

  const submit = () => {
    if (name.length == 0 || email.length == 0 || message.length == 0) {
      setAlertMessage({
        ...alertMessage,
        text: "Make sure Name, Email and Message are provided!",
        show: true,
      });
    } else {
      setLoader(true);

      // we will send user comment to server with the following code
      var ApiUrl = Connection.url + Connection.FeedBacks;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const data = {
        name: name,
        email: email,
        phone: phone,
        feedback: message,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          var message = response[0].message;

          if (message === "succeed") {
            setAlertMessage({
              ...alertMessage,
              text: "Successfully sent!",
              textColor: Constants.background,
              background: Constants.Success,
              show: true,
              Icon: true,
            });
            setLoader(false);
          }
        });
      //last edited
    }
  };
  useEffect(() => {
    getUserInfo();
    return () => {};
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Linking.openURL("mailto:contact@p2b-ethiopia.com")}
        >
          <View style={styles.headerTitle}>
            <Text style={styles.description}>You can reach us 24/7 via</Text>
            <Text style={styles.emailAddress}>contact@p2b-ethiopia.com</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.alternateEmail}>
          <MaterialIcons
            name="alternate-email"
            size={24}
            color={Constants.primary}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}> Enter Your Name </Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Your name"
          value={name}
          onChangeText={(userdata) => setName(userdata)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}> Enter Your Email </Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email address"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}> Enter Your Mobile (optional) </Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="+2519********"
          value={phone}
          onChangeText={(phone) => setPhone(phone)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}> How can we help you? </Text>
        <TextInput
          style={styles.multilineStyle}
          placeholder="write here..."
          value={message}
          onChangeText={(msg) => setMessage(msg)}
          numberOfLines={3}
          multiline={true}
        />
        {alertMessage.show ? (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: alertMessage.background },
            ]}
          >
            <Text
              style={[
                styles.error,
                {
                  color: alertMessage.textColor,
                },
              ]}
            >
              {alertMessage.text}
            </Text>
            {alertMessage.Icon ? (
              <MaterialCommunityIcons
                name="checkbox-marked-circle"
                size={24}
                color={Constants.background}
              />
            ) : (
              <MaterialIcons name="error" size={24} color={Constants.Danger} />
            )}
          </View>
        ) : null}
      </View>

      {loader ? (
        <ActivityIndicator
          style={[styles.buttonStyle]}
          size="small"
          color={Constants.background}
        />
      ) : (
        <TouchableOpacity style={[styles.buttonStyle]} onPress={submit}>
          <Text style={styles.buttonText}>Submit </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    backgroundColor: Constants.background,
  },
  topContainer: {
    width: "84%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: Constants.transparentPrimary,
    marginTop: 40,
    marginBottom: 10,
    paddingVertical: 15,
    borderRadius: Constants.medium,
  },
  headerTitle: {
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: Constants.headingtwo,
    color: Constants.Secondary,
    paddingHorizontal: 10,
    fontFamily: Constants.fontFam,
    lineHeight: 25,
  },
  emailAddress: {
    fontSize: Constants.headingtwo,
    color: Constants.primary,
    paddingHorizontal: 10,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    lineHeight: 25,
  },
  alternateEmail: {
    backgroundColor: Constants.background,
    padding: 6,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    justifyContent: "center",
    alignSelf: "center",
    width: "94%",
    marginTop: 10,
  },
  labels: {
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
    fontFamily: Constants.fontFam,
    lineHeight: 25,
    marginLeft: 25,
  },

  inputStyle: {
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    padding: Constants.paddTwo,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    width: "94%",
    paddingLeft: 20,
    marginTop: 2,
    alignSelf: "center",
    borderWidth: 0.3,
    borderColor: Constants.purple,
  },
  multilineStyle: {
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    padding: Constants.paddTwo,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    width: "94%",
    paddingLeft: 20,
    marginTop: 2,
    borderWidth: 0.3,
    borderColor: Constants.purple,
    alignItems: "flex-start"
  },
  buttonStyle: {
    width: "88%",
    borderRadius: Constants.tiny,
    backgroundColor: Constants.purple,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: Constants.background,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "94%",
    paddingHorizontal: 15,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: Constants.mediumbox,
    padding: Constants.paddTwo,
  },
  error: {
    fontWeight: Constants.Bold,
    color: Constants.Danger,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    lineHeight: 25,
    marginLeft: 5,
  },
  multiineStyle:{
    alignSelf: "flex-start",
  }
});

export default Questions;
