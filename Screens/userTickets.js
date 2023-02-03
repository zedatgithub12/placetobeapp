//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { HelperText } from "react-native-paper";
import BoughtTicket from "../Components/BoughtTicket";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import Sold from "../src/boughtt";

// create a component
const UserTickets = ({ navigation }) => {
  const [Data, setData] = useState({
    userId: "",
    logged: false,
    Sold: { ...Sold },
    loading: true,
    found: true,
  });
  const [sold, setSold] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const FeatchTicket = async () => {
    var userId = await AsyncStorage.getItem("userId");
    setRefreshing(true);

    if (userId.length !== 0) {
      var APIUrl = Connection.url + Connection.boughtTickets;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      var Data = {
        userId: userId,
      };

      fetch(APIUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((reponse) => reponse.json())
        .then((response) => {
          var message = response[0].message;
          if (message === "succeed") {
            var ticket = response[0].ticket;
            setSold(ticket);

            setData({
              loading: false,
              found: true,
            });

            setRefreshing(false);
          } else if (message === "no ticket") {
            setData({
              ...Data,
              found: false,
            });
          } else {
            setData({
              ...Data,
              loading: true,
            });
          }
        });
    } else {
      return (
        <View>
          <Text>No repsonse</Text>
        </View>
      );
    }
  };

  // refresh the listing
  const Refresh = async () => {
    var userId = await AsyncStorage.getItem("userId");
    setRefreshing(true);

    if (userId.length !== 0) {
      var APIUrl = Connection.url + Connection.boughtTickets;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      var Data = {
        userId: userId,
      };

      fetch(APIUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((reponse) => reponse.json())
        .then((response) => {
          var message = response[0].message;
          if (message === "succeed") {
            var ticket = response[0].ticket;
            setSold(ticket);

            setData({
              loading: false,
            });
            setRefreshing(false);
          } else {
            setData({
              ...Data,
              loading: true,
            });
          }
        })
        .catch((error) => {
          setData({
            ...Data,
            loading: true,
          });
          setRefreshing(false);
        });
    } else {
      return (
        <View>
          <Text>No repsonse</Text>
        </View>
      );
    }
  };

  //
  const TicketName = (iconname) => {
    var name;
    switch (iconname) {
      case "Early Bird":
        name = "bird";
        break;

      case "Regular":
        name = "ticket";
        break;

      case "VIP":
        name = "star-outline";
        break;

      case "VVIP":
        name = "star-shooting-outline";
        break;

      case "Student":
        name = "book-education-outline";
        break;

      case "Kids":
        name = "baby-face-outline";
        break;

      case "Adult":
        name = "face-man";
        break;

      case "Member":
        name = "account-group-outline";
        break;

      default:
        name = "ticket";
    }
    return name;
  };

  //ticket icon color
  const TicketColor = (iconname) => {
    var Color;

    switch (iconname) {
      case "Early Bird":
        Color = "#ff24da";
        break;

      case "Regular":
        Color = "#00a2ff";

        break;

      case "VIP":
        Color = "#ffc800";

        break;

      case "VVIP":
        Color = "#ffb300";

        break;

      case "Student":
        Color = "#00c4de";

        break;

      case "Kids":
        Color = "#ff3686";

        break;

      case "Adult":
        Color = "#ff551c";

        break;

      case "Member":
        Color = "#5fcc41";

        break;

      default:
        Color = "#ffbb00";
    }
    return Color;
  };

  const renderItem = ({ item }) => (
    <BoughtTicket
      id={item.id}
      title={item.event_name}
      iconName={TicketName(item.tickettype)}
      iconColor={TicketColor(item.tickettype)}
      quantity={item.quantity}
      type={item.tickettype}
      onPress={() => navigation.navigate("BoughtDetail", item)}
    />
  );

  useEffect(() => {
    FeatchTicket();

    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={sold}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={Refresh}
        refreshing={refreshing}
        ListHeaderComponent={() =>
          Data.found ? null : (
            <View style={styles.containertwo}>
              <Image
                source={require("../assets/NotFound.png")}
                resizeMode="contain"
                style={styles.notFound}
              />
              <Text style={styles.emptyMessageStyle}>No Ticket Yet!</Text>
              <HelperText style={{ alignSelf: "center" }}></HelperText>
            </View>
          )
        }
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
  flex:1,
  },
  containertwo:{
    alignSelf: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 10,
    padding: 28,
  },
  notFound: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  emptyMessageStyle: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.Secondary,

    alignSelf: "center",
    justifyContent: "center",
  },
  listEnd: {
    padding: 20,
    backgroundColor: Constants.transparentPrimary,
    marginTop: 5,
    margin: 5,
    borderRadius: Constants.tinybox,
    marginBottom: 62,
  },
});

//make this component available to the app
export default UserTickets;
