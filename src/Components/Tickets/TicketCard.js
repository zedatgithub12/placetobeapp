//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Constants from "../../constants/Constants";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Card, Caption } from "react-native-paper";
import Connection from "../../constants/connection";

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
    <View style={styles.EventContainer}>
      <Pressable onPress={EventName}>
        <View style={styles.ImageContainer}>
          <Card.Cover
            source={{ uri: featuredImageUri + picture }}
            style={styles.FeaturedImagestyle}
          />
        </View>

        <View style={styles.cardContent}>
          <Text numberOfLines={1} style={styles.TicketName}>
            {title}
          </Text>
          <Text style={styles.type}>{type} Ticket</Text>

          <View style={styles.pricesection}>
            <View style={styles.price}>
              <Text style={styles.pricetxts} numberOfLines={1}>
                {price}
              </Text>
              <Text style={styles.pricetxts} numberOfLines={1}>
                {" "}
                Birr
              </Text>
            </View>
            <View>
              <Text style={styles.discount} numberOfLines={1}>
                {discount == 0 ? null : discount}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.BuyBtn}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Text style={styles.checkin}>Buy</Text>
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  EventContainer: {
    width: 165,
    justifyContent: "center",
    margin: 5,
    padding: 4,
    backgroundColor: Constants.background,
  },
  ImageContainer: {
    width: 156,
    height: 110,
  },
  FeaturedImagestyle: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    resizeMode: "contain",
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

  BuyBtn: {
    width: "96%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Constants.transparentPrimary,
    margin: 6,
    marginTop: 8,
    padding: 4,
    borderRadius: 6,
    textAlign: "center",
  },
  checkin: {
    paddingHorizontal: 8,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 4,
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
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.primaryTwo,
    marginTop: 4,
  },
  discount: {
    fontSize: Constants.textSize,
    fontWeight: Constants.Boldtwo,
    color: "#999",
    marginTop: 4,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
});

//make this component available to the app
export default TicketCard;
