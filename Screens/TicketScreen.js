import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, FlatList, Alert } from "react-native";
import { Paragraph, Title } from "react-native-paper";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import TicketListing from "../Components/TicketsListing";
import { Button, Menu, Divider, Provider } from "react-native-paper";

// ticket functional component
function Tickets({ navigation }) {
  const [loading, setLoading] = React.useState(true);
  const [tickets, setTickets] = React.useState(); //tickets
  const [refreshing, setRefreshing] = React.useState(false); //flalist refreshing state
  const [shimmer, setShimmer] = useState(false); //shimmer effect state

  const myTickets = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    let id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.myTickets;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      id: id,
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
      signal:signal
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;
        var ticket = response[0].Tickets;

        if (message === "succeed") {
          setLoading(true);
          setTickets(ticket);
          // console.log(ticket);
        } else {
          setLoading(false);
          // console.log(ticket);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
      return () => {
        // cancel the request before component unmounts
        controller.abort();
      };
  };

  //ticket type icon
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
  // ticket status
  const Status = (Tstatus) => {
    var ticketStatus;

    switch (Tstatus) {
      case "0":
        ticketStatus = "Pending";
        break;

      case "1":
        ticketStatus = "In-Stock";
        break;

      case "2":
        ticketStatus = "Declined";
        break;

      case "3":
        ticketStatus = "Sold-out";
        break;

      default:
        ticketStatus = "Pending";
    }
    return ticketStatus;
  };

  //status text color
  const StatusText = (textColor) => {
    var StatusColor;

    switch (textColor) {
      case "0":
        StatusColor = "#787878";
        break;

      case "1":
        StatusColor = "#0bb321";
        break;

      case "2":
        StatusColor = "#ff3d4d";
        break;

      case "3":
        StatusColor = "#787878";
        break;

      default:
        StatusColor = "#787878";
    }
    return StatusColor;
  };
  // refresh ticket listing
  const RefreshList = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    setRefreshing(true);

    let id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.myTickets;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      id: id,
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;
        var ticket = response[0].Tickets;

        if (message === "succeed") {
          setLoading(true);
          setTickets(ticket);
          setRefreshing(false);
        } else {
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      // cancel the request before component unmounts
      controller.abort();
    };
  };

  // render ticket listing
  const renderItem = ({ item }) => (
    <TicketListing
      event={item.event_name}
      type={item.tickettype}
      price={item.currentprice}
      iconName={TicketName(item.tickettype)}
      iconColor={TicketColor(item.tickettype)}
      status={Status(item.status)}
      textColor={StatusText(item.status)}
      onPress={() => navigation.navigate("Ticket Detail", { item })}
      longPress={() => navigation.navigate("Update Ticket", { item })}
    />
  );

  useEffect(() => {
    let isApiSubscribed = true;

    if (isApiSubscribed) {
      myTickets();
    }

    return () => {
      isApiSubscribed = false;
    };
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <FlatList
          data={tickets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onRefresh={RefreshList}
          refreshing={refreshing}
          // ListHeaderComponent={() =>
          //   notFound ? (
          //     <View style={styles.noNoticeContainer}>
          //       <Image
          //         source={require("../assets/noNotification.png")}
          //         style={styles.noNoticeImage}
          //         resizeMode="contain"
          //       />
          //       <Title style={styles.prompttxt}>
          //         You have no notification yet!
          //       </Title>
          //     </View>
          //   ) : null
          // }
        />
      ) : (
        <View style={styles.noTicketContainer}>
          <Image
            source={require("../assets/noticket.png")}
            style={styles.noTicketImage}
            resizeMode="contain"
          />
          <Title style={styles.prompttxt}>No ticket yet!</Title>
          <Paragraph>Ticket you added to event will be listed here.</Paragraph>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Constants.Faded,
    paddingVertical: 6,
  },
  noTicketContainer: {
    flex: 1,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  noTicketImage: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  prompttxt: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
  eventsBtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.primary,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventstxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
  },
});

export default Tickets;
