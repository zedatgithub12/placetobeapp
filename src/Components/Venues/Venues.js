import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import Constants from "../constants/Constants";
import {MaterialCommunityIcons } from "react-native-vector-icons";
import {
  Card,
  Caption,
} from "react-native-paper";

const Venues = ({
  title,
  location,
  Category,
  FeaturedImage,
  onPress,
}) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <Card style={styles.EventContainer}>
        <View style={styles.ImageContainer}>
          <Card.Cover
            source={FeaturedImage}
            style={styles.FeaturedImagestyle}
            resizeMode="cover"
          />
        </View>

        <Card.Content style={styles.cardContent}>
          <Text style={styles.venueLocation}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={15}
              style={styles.eventIcons}
            />
            {location}
          </Text>
          <Text numberOfLines={1} style={styles.VenueName}>
            {title}
          </Text>
          <Caption style={{ color: Constants.primary }}>{Category}</Caption>
        </Card.Content>
      </Card>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  EventContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: Constants.background,
    margin: 8,
    elevation: 4,
  },
  ImageContainer: {
    width: "100%",
    height: 100,
  },
  FeaturedImagestyle: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },
  cardContent: {
    paddingVertical: 10,
  },
  VenueName: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  eventIcons: {
    padding: 2,
    paddingRight: 5,
    fontWeight: Constants.Boldtwo,
    color: Constants.bottomTabIcon,
  },
  venueLocation: {
    fontSize: Constants.thirty,
    fontWeight: Constants.Boldtwo,
    color: Constants.bottomTabIcon,
  },
  checkInBtnContainer: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  checkInBtn: {
    backgroundColor: Constants.primary,
    borderRadius: Constants.tinybox,
    padding: Constants.padd,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  checkin: {
    fontWeight: Constants.Bold,
    color: Constants.mainText,
    textAlign: "center",
  },
});
export default Venues;
