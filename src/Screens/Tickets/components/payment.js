//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Constants from "../../../constants/Constants";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Dimensions } from "react-native";

// payemnt gateway selection component a component
const Gateways = ({ logo, name, isChecked, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.btn,
        isChecked
          ? [
              { backgroundColor: theme.background.main },
              { borderWidth: 0.5 },
              { borderColor: theme.success.main },
            ]
          : { backgroundColor: theme.background.main },
      ]}
      onPress={onPress}
    >
      {isChecked ? (
        <MaterialCommunityIcons
          name="check-circle"
          size={18}
          color={theme.success.main}
          style={{ position: "absolute", right: 6, top: 6 }}
        />
      ) : (
        <MaterialCommunityIcons
          name="radiobox-blank"
          size={18}
          color={Constants.Secondary}
          style={{ position: "absolute", right: 6, top: 6 }}
        />
      )}
      <View style={styles.LeftPayment}>
        <Image style={styles.Paymentlogo} source={logo} />
        <Text style={[styles.btnText, isChecked && { color: "black" }]}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  paybuttonStyle: {
    width: 50,
  },
  Paymentlogo: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  LeftPayment: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnGroup: {
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    height: "auto",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    alignItems: "center",
  },
  btn: {
    width: Dimensions.get("screen").width / 3.3,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 8,
    paddingVertical: 20,
    margin: 10,
  },
  btnText: {
    // textAlign: 'center',
    fontWeight: "bold",

    fontSize: 14,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
  },
});

//make this component available to the app
export default Gateways;
