//import liraries
import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";

import { Typography } from "../../themes/typography";
import { useTheme } from "@react-navigation/native";
import Constants from "../../constants/Constants";
import Connection from "../../constants/connection";

// related event card

const RelatedEvent = ({ onPress, picture, name }) => {
  const { theme } = useTheme();

  var featuredImageUri = Connection.url + Connection.assets;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.relatedEventListing}
    >
      <Image
        source={{ uri: featuredImageUri + picture }}
        style={[
          styles.featuredEventImage,
          {
            width: 120,
            height: 120,
            borderRadius: 5,
            borderWidth: 1,
          },
        ]}
        resizeMode="cover"
      />
      <View>
        <Text
          style={{
            width: 120,
            fontFamily: Typography.family,
            fontSize: Typography.size.headingthree,
            fontWeight: Typography.weight.bold,
            color: theme.dark.main,
            paddingVertical: 3,
            marginLeft: 2,
          }}
          numberOfLines={2}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  RelatedEventContainer: {
    margin: 10,
    marginBottom: 5,
  },
  relatedEventListing: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 3,
    marginLeft: 7,
    marginVertical: 10,
    padding: 3,
    zIndex: 2,
  },
  featuredEventImage: {
    borderRadius: Constants.mediumbox,
  },

  organizer: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
});

//make this component available to the app
export default RelatedEvent;
