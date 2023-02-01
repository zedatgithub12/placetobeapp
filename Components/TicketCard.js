//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Constants from "../constants/Constants";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Card,Caption } from "react-native-paper";
import Connection from "../constants/connection";

// create a component
const TicketCard = ({title,picture,type, price, onPress,EventName }) => {
  const featuredImageUri = Connection.url + Connection.assets;
  return (
    <Card style={styles.EventContainer}>
      <Pressable onPress={EventName}>
        <View style={styles.ImageContainer}>
          <Card.Cover
            source={{ uri: featuredImageUri + picture }}
            style={styles.FeaturedImagestyle}
            resizeMode="cover"
          />
        </View>

        <Card.Content style={styles.cardContent}>
          <Text
          
           numberOfLines={1} style={styles.VenueName}>
            {title}
          </Text>
          <Caption style={styles.date}>{type} Ticket</Caption>

          <View style={styles.pricesection}>
            <View style={styles.price}>
              <Text style={styles.pricetxts}>{price}</Text>
              <Text style={styles.pricetxts}> ETB</Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
              <Text style={styles.checkin}>Buy</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Pressable>
    </Card>
  );
};

// define your styles
const styles = StyleSheet.create({
  EventContainer: {
    width: 150,
    height: 178,
    justifyContent: "center",
    backgroundColor: Constants.background,
    margin: 4,
    paddingBottom: 12,
    //elevation: 4,
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
    paddingVertical: 2,
  },
  VenueName: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    alignSelf: "flex-start",
  },
  price: {
    flexDirection: "row",
    position: "absolute",
    bottom: -24,
    left: 0,
  },
  checkin: {
    position: "absolute",
    bottom: -26,
    right: 0,
    borderRadius: Constants.tinybox,
    padding: 2,
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: Constants.primary,
    fontWeight: Constants.Boldtwo,
    color: Constants.mainText,
    textAlign: "center",
  },
  pricesection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pricetxts: {
    fontWeight: Constants.Boldtwo,
    color: Constants.mainText,
  },
});

//make this component available to the app
export default TicketCard;
