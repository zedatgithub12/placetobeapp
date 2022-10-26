import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import Constants from "../constants/Constants";
import {
  FontAwesome5,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Connection from "../constants/connection";
import { HelperText } from "react-native-paper";

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
  
  const featuredImageUri = Connection.url+Connection.assets;
  return (
    <TouchableNativeFeedback onPress={onPress} style={styles.lists}>
      <View style={[styles.EventContainer,{borderRightColor: category}]}>
        <View style={styles.ImageContainer}>
          <Image source={{uri:featuredImageUri+FeaturedImage}} style={styles.FeaturedImagestyle} />
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
            <Text style={styles.EventVenue}>
              
              {venue}
            </Text>
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
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  EventContainer: {
    flexDirection: "row",
    width: "94%",
    padding: 3,
    marginTop: 2,
    borderRadius:4,
    alignSelf: "center",
    backgroundColor:Constants.Faded,
    borderRightWidth: 6,
    
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
    justifyContent:"space-between",
  },
  EventName: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse
  },
  eventIcons: {
    padding: 3,
    color: Constants.primary
  },
  //flatlist event date styles
  EventDate:{
  color:Constants.Secondary,
  fontFamily:Constants.fontFam,
  fontWeight:Constants.Boldtwo,
  paddingLeft:0,
  marginLeft:2,
  },
  // venue container style
  venueContainer:{
  flexDirection:"row",
  justifyContent:"center",
  alignItems:"center",
  },
  // event venue text style
  EventVenue: {
    marginLeft: 4,
    color:Constants.Inverse,
    fontFamily:Constants.fontFam,
  
  },
  // map marker for event venue name
  VenueIcon:{
    color: Constants.primary
  },
  //event ticket container box style
  ticketContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Constants.transparentPrimary,
    marginTop:5,
    padding:2,
    paddingRight:4,
    borderRadius: Constants.tinybox,
    minWidth: 60,
 
  },
   //event price icon styles
   ticketIcon:{
    marginRight:3,
    color: Constants.primary
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
