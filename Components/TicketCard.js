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
import { Card, Caption } from "react-native-paper";
import Connection from "../constants/connection";

// create a component
const TicketCard = ({
  title,
  picture,
  type,
  price,
  onPress,
  EventName,
  discount,
}) => {
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

        <View style={styles.cardContent}>
          <Text numberOfLines={1} style={styles.TicketName}>
            {title}
          </Text>
          <Text style={styles.type}>{type} Ticket</Text>

          <View style={styles.pricesection}>
            <View style={styles.price}>
              <Text style={styles.pricetxts} numberOfLines={1}>{price}</Text>
              <Text style={styles.pricetxts} numberOfLines={1}> Birr</Text>
            </View>
            <View>
              <Text style={styles.discount} numberOfLines={1}>
                {discount == 0 ? null : discount}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.checkinbtn}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Text style={styles.checkin}>Buy</Text>
        </TouchableOpacity>
      </Pressable>
    </Card>
  );
};

// define your styles
const styles = StyleSheet.create({
  EventContainer: {
    width: 115,
    height: 150,
    justifyContent: "center",
    backgroundColor: Constants.background,
    margin: 3,
    paddingBottom: 12,
  },
  ImageContainer: {
    width: "100%",
    height: 84,
  },
  FeaturedImagestyle: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },
  cardContent: {
    paddingVertical: 2,
    padding: 6,
  },
  TicketName: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
    alignSelf: "flex-start",
    width: "100%",
  },
  type: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.textSize,
  },

  checkinbtn: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
  },
  checkin: {
    paddingHorizontal: 8,
    justifyContent: "center",
    backgroundColor: Constants.primary,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
    textAlign: "center",
    borderBottomLeftRadius: 4,
    borderTopRightRadius:4,
    fontSize: Constants.headingthree,
  },
  pricesection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    flexDirection: "row",
  },
  pricetxts: {
    fontSize: Constants.textSize,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    marginTop: 4,
  },
  discount:{
    fontSize: Constants.textSize,
    fontWeight: Constants.Boldtwo,
    color: Constants.primary,
    marginTop: 4,
    textDecorationLine: 'line-through',
     textDecorationStyle: 'solid',
     
  }

});

//make this component available to the app
export default TicketCard;
