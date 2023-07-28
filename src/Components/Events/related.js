//import liraries
import React from "react";

import { View, Text, StyleSheet, Image, Pressable } from "react-native";

import { Typography } from "../../themes/typography";
import { useTheme } from "@react-navigation/native";
import Constants from "../../constants/Constants";
import Connection from "../../constants/connection";
import { DateFormater } from "../../Utils/functions";

// related event card

const RelatedEvent = ({ onPress, picture, name, date }) => {
  const { theme } = useTheme();

  var featuredImageUri = Connection.url + Connection.assets;
  return (
    <Pressable onPress={onPress} style={styles.relatedEventListing}>
      <View>
        <Image
          source={{ uri: featuredImageUri + picture }}
          style={[
            styles.featuredEventImage,
            {
              width: 160,
              height: 160,
              borderRadius: 5,
              borderWidth: 1,
              resizeMode: "cover",
            },
          ]}
          resizeMode="contain"
        />
        <View>
          <Text
            style={{
              width: 160,
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
      </View>
    </Pressable>
  );
};

// define your styles
const styles = StyleSheet.create({
  RelatedEventContainer: {
    margin: 10,
    marginBottom: 5,
  },
  relatedEventListing: {
    width: 180,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    borderRadius: 3,
    marginLeft: 10,
    marginVertical: 10,
    padding: 3,
  },
  featuredEventImage: {
    borderRadius: Constants.mediumbox,
    marginRight: 12,
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
