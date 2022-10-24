//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
// create a component
const Listing = ({ image, username, category, onPressProfile }) => {
  var featuredImageUri = Connection.url + Connection.assets;

  return (
    <TouchableNativeFeedback onPress={onPressProfile} style={styles.container}>
      <View style={styles.innerContainers}>
        <Image
          source={{ uri: featuredImageUri + image }} //featured image source
          resizeMode="cover"
          style={styles.profileImage} //featured image styles
        />

        <View style={styles.txtContentContainer}>
          <Text style={styles.usernames} numberOfLines={1}>
            {username}
          </Text>
          <Text style={styles.categories} numberOfLines={1}>
            {category}
          </Text>
        </View>
        <Ionicons
          name="open-outline"
          size={24}
          style={styles.followBtn}
          color={Constants.primary}
        />
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {},
  innerContainers: {
    width: "99%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
    marginVertical: 2,
    paddingVertical: 4,

  },
  profileImage: {
    width: "14%",
    backgroundColor: Constants.purple,
    height: 50,
    width: 50,
    borderRadius: 35,
  },
  txtContentContainer: {
    width: "70%",
    marginLeft: 15,
    borderBottomWidth:0.5,
    borderColor: "#eeeeee",
    paddingBottom:10,
  },
  usernames: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    textTransform: "capitalize",
    color: Constants.purple,
  },
  categories: {
    fontSize: Constants.textSize,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
    textTransform: "capitalize",
  },
  followBtn: {
    position: "absolute",
    right: 20,
    padding: 3.5,
    borderRadius: Constants.borderRad,
    alignItems: "center",
    justifyContent: "center",
  },
  followerstxt: {
    textTransform: "capitalize",
  },
});

//make this component available to the app
export default Listing;
