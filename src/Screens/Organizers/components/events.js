//import liraries
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Connection from "../../../api";
import { MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import Constants from "../../../constants/Constants";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../../themes/typography";

// create a component
const OrganizerEvents = ({ FeaturedImage, status, onPress }) => {
  const { theme } = useTheme();
  const [statusCond, setStatusCond] = useState({
    statusType: status,
    background: Constants.Faded,
    color: Constants.Inverse,
  });

  var featuredImageUri = Connection.url + Connection.assets;
  return (
    <TouchableOpacity
      style={styles.imageContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {statusCond.statusType === "Happening" ? (
        <View style={[styles.statusStyle, { backgroundColor: "#0008" }]}>
          <Text
            style={[
              styles.stutusText,
              {
                color: theme.background.main,
                fontWeight: Typography.weight.semiBold,
                fontSize: Typography.size.textSize,
                fontFamily: Typography.family,
              },
            ]}
          >
            {status}
          </Text>
        </View>
      ) : statusCond.statusType === "Passed" ? (
        <View style={[styles.statusStyle, { backgroundColor: "#0008" }]}>
          <Text
            style={[
              styles.stutusText,
              {
                color: theme.background.main,
                fontWeight: Typography.weight.semiBold,
                fontSize: Typography.size.textSize,
                fontFamily: Typography.family,
              },
            ]}
          >
            {status}
          </Text>
        </View>
      ) : (
        <View style={[styles.statusStyle, { backgroundColor: "#0008" }]}>
          <Text
            style={[
              styles.stutusText,
              {
                color: theme.background.main,
                fontWeight: Typography.weight.semiBold,
                fontSize: Typography.size.textSize,
                fontFamily: Typography.family,
              },
            ]}
          >
            {status}
          </Text>
        </View>
      )}
      <Image
        source={{ uri: featuredImageUri + FeaturedImage }}
        style={styles.posters}
      />
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    marginLeft: 3,
    // To maintain the square shape of the images
  },
  posters: {
    width: Dimensions.get("screen").width / 3 - 4, // Subtracting margin from width
    height: Dimensions.get("screen").width / 3 - 4,
    resizeMode: "cover",
    marginBottom: 3,
  },
  statusStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: 2,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 10,
  
  },
  stutusText: {
    alignSelf: "center",
  },
});

//make this component available to the app
export default OrganizerEvents;
