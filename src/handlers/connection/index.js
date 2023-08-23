//import liraries
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Caption } from "react-native-paper";
import Constants from "../../constants/Constants";
import { useTheme } from "@react-navigation/native";

/************************ No Connection Handler ********************** */
const NoConnection = ({ ...props }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.noConnection}>
      <Image
        source={require("../../assets/images/connect.png")}
        style={styles.connImage}
        resizeMode="contain"
      />

      <Text>No Connection</Text>
      <Caption>Please Check your internet connection</Caption>
      <TouchableOpacity onPress={props.onPress} style={styles.eventsBtn}>
        <Text style={styles.eventstxt}>
          {props.isLoading ? (
            <ActivityIndicator size="small" color={theme.dark.main} />
          ) : (
            "Retry"
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  noConnection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  connImage: {
    height: 400,
    width: 300,
  },
  eventsBtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventstxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.primary,
  },
  icon: {
    width: 80,
    height: 80,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default NoConnection;
