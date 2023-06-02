import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import Constants from "../../constants/Constants";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
} from "react-native-vector-icons";
import Connection from "../../constants/connection";
import { HelperText } from "react-native-paper";

const OrganizerEvents = ({
  title,
  date,
  venue,
  time,
  Price,
  FeaturedImage,
  status,
  onPress,
}) => {
  const [statusCond, setStatusCond] = useState({
    statusType: status,
    background: Constants.Faded,
    color: Constants.Inverse,
  });

  const featuredImageUri = Connection.url + Connection.assets;

  return (
    <TouchableNativeFeedback onPress={onPress} style={styles.lists}>
      <View style={styles.EventContainer}>
        <View style={styles.ImageContainer}>
          <Image
            source={{ uri: featuredImageUri + FeaturedImage }}
            style={styles.FeaturedImagestyle}
          />
        </View>

        <View style={styles.ContainerTwo}>
          <Text style={styles.EventName} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.sectionOne}>
            <FontAwesome5
              name="calendar-check"
              size={13}
              style={styles.eventIcons}
            />
            <HelperText style={styles.EventDate}>
              {date} ({time})
            </HelperText>
          </View>
          <View style={styles.sectionTwo}>
            <View //venue name container
              style={styles.venueContainer}
            >
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={16}
                style={styles.VenueIcon}
              />
              <Text style={styles.EventVenue}>{venue}</Text>
            </View>

            <View style={styles.ticketContainer}>
              <MaterialCommunityIcons
                name="ticket"
                size={14}
                style={styles.ticketIcon}
              />
              <Text style={styles.EventPrice}>{Price}</Text>
            </View>
          </View>
        </View>

        {statusCond.statusType === "Happening" ? (
          <View style={[styles.statusStyle, { backgroundColor: "#ecfbe2" }]}>
            <MaterialCommunityIcons
              name="check-circle"
              size={16}
              color={Constants.Success}
            />
            <Text style={[styles.stutusText, { color: Constants.Success }]}>
              {status}
            </Text>
          </View>
        ) : statusCond.statusType === "Passed" ? (
          <View style={[styles.statusStyle, { backgroundColor: "#ffeae6" }]}>
            <AntDesign
              name="exclamationcircle"
              size={14}
              color={Constants.Danger}
            />

            <Text style={[styles.stutusText, { color: Constants.Danger }]}>
              {status}
            </Text>
          </View>
        ) : (
          <View style={[styles.statusStyle, { backgroundColor: "#e6fdff" }]}>
            <MaterialCommunityIcons
              name="timer"
              size={16}
              color={Constants.PrimaryBlue}
            />
            <Text style={[styles.stutusText, { color: Constants.PrimaryBlue }]}>
              {status}
            </Text>
          </View>
        )}
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  EventContainer: {
    flexDirection: "row",
    width: "96%",
    paddingLeft: 4,
    padding: 3,
    marginTop: 4,
    borderRadius: Constants.mediumbox,
    alignSelf: "center",
    backgroundColor: Constants.background,
  },
  ImageContainer: {
    padding: 2,
  },
  FeaturedImagestyle: {
    width: 90,
    height: 100,
    borderRadius: Constants.tiny,
  },
  ContainerTwo: {
    width: "68%",
    padding: 4,
    marginLeft: 5,
  },
  sectionOne: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTwo: {
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  EventName: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
  },
  eventIcons: {
    padding: 3,
    color: Constants.primary,
  },
  //flatlist event date styles
  EventDate: {
    color: Constants.Secondary,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    paddingLeft: 0,
    marginLeft: 2,
  },
  // venue container style
  venueContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  // event venue text style
  EventVenue: {
    marginLeft: 4,
    color: Constants.Inverse,
    fontFamily: Constants.fontFam,
  },
  // map marker for event venue name
  VenueIcon: {
    color: Constants.primary,
  },
  //event ticket container box style
  ticketContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Constants.transparentPrimary,
    marginTop: 5,
    padding: 2,
    paddingRight: 4,
    borderRadius: Constants.tinybox,
    minWidth: 60,
  },
  //event price icon styles
  ticketIcon: {
    marginRight: 3,
    color: Constants.primary,
  },
  // event price text style
  EventPrice: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  statusStyle: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 4,
    right: 10,
    paddingHorizontal: 8,
    padding: 3,
    borderRadius: Constants.tinybox,
  },
  stutusText: {
    alignSelf: "center",
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    marginLeft: 5,
    textShadowColor: Constants.Inverse,
    textShadowOffset: {
      width: 2,
      height: 8,
    },
  },
});
export default OrganizerEvents;
