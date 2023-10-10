import React from "react";
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
} from "react-native-vector-icons";
import { useTheme } from "@react-navigation/native";
import Connection from "../../api";

const Events = ({
  title,
  date,
  venue,
  time,
  Price,
  FeaturedImage,
  category,
  onPress,
}) => {
  const { theme } = useTheme();
  var featuredImageUri = Connection.url + Connection.assets;
  return (
    <TouchableNativeFeedback onPress={onPress} style={styles.lists}>
      <View style={[styles.EventContainer, { borderRightColor: category }]}>
        <View style={styles.Imagecontainer}>
          <Image
            source={{ uri: featuredImageUri + FeaturedImage }}
            style={styles.FeaturedImagestyle}
          />
        </View>

        <View style={styles.ContentContainer}>
          <Text style={styles.EventName} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.dateContainer}>
            <FontAwesome5
              name="calendar-check"
              size={13}
              style={[styles.eventIcons, { color: theme.primary.main }]}
            />
            <Text style={[styles.textContent, { fontWeight: Constants.Bold }]}>
              {date} ({time})
            </Text>
          </View>
          <View style={styles.sectionTwo}>
            <View //venue name container
              style={styles.venueContainer}
            >
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={16}
                style={[styles.icon, { color: theme.primary.main }]}
              />
              <Text style={styles.textContent} numberOfLines={1}>
                {venue}
              </Text>
            </View>

            <View style={styles.ticketContainer}>
              <MaterialCommunityIcons
                name="ticket"
                size={14}
                style={[styles.icon, { color: theme.primary.main }]}
              />
              <Text style={styles.textContent} numberOfLines={1}>
                {Price}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  EventContainer: {
    flexDirection: "row",
    width: "97%",
    marginTop: 5,
    alignSelf: "center",
    backgroundColor: Constants.background,
    borderRightWidth: 3,
    marginHorizontal: 12,
    borderBottomLeftRadius: Constants.tiny,
    borderTopLeftRadius: Constants.tiny,
  },
  Imagecontainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 106,
    height: 106,
  },
  FeaturedImagestyle: {
    width: 100,
    height: 100,
    borderRadius: Constants.tiny,
    objectFit: "contain",
    margin: "auto",
  },
  ContentContainer: {
    width: "68%",
    padding: 4,
    paddingTop: 0,
    marginLeft: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTwo: {
    alignItems: "center",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  EventName: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
    textTransform: "capitalize",
    marginVertical: 4,
  },
  eventIcons: {
    paddingLeft: 3,
  },
  //flatlist event date styles
  EventDate: {
    marginLeft: 8,
    marginTop: 3,
    color: Constants.Inverse,
    fontFamily: Constants.fontFam,
    fontSize: Constants.textSize,
    fontWeight: Constants.Boldtwo,
    backgroundColor: "#343",
  },
  // venue container style
  venueContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  // event venue text style
  textContent: {
    marginLeft: 6,
    marginVertical: 3,
    color: Constants.Inverse,
    fontFamily: Constants.fontFam,
    fontSize: Constants.textSize,
    fontWeight: Constants.Boldtwo,
    alignItems: "center",
  },
  // map marker for event venue name
  icon: {
    color: Constants.primary,
  },
  //event ticket container box style
  ticketContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 60,
  },
  //event price icon styles
  ticketIcon: {
    color: Constants.Inverse,
  },
  // event price text style
  EventPrice: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
});
export default Events;
