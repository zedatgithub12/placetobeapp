//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { AuthContext } from "../../Components/context";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";
import NotLoggedIn from "../../handlers/auth";
import NoTicket from "../../handlers/Tickets";
import NoConnection from "../../handlers/connection";
import TicketListing from "../../Components/Tickets/TicketsListing";
import { Status, StatusText } from "../../Utils/functions";
import Loader from "../../ui-components/ActivityIndicator";
import Internet from "../../connection";

/********************************** User Tickets Listing Screen ************************** */

const UserTickets = ({ navigation }) => {
  const { userStatus } = useContext(AuthContext);
  const logged = userStatus.logged;
  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [sold, setSold] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [Loading, setLoading] = useState(true);
  const FeatchTicket = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var userId = await AsyncStorage.getItem("userId");
    setLoading(true);

    var APIUrl = Connection.url + Connection.boughtTickets + userId;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    await fetch(APIUrl, {
      method: "GET",
      headers: headers,
      signal: signal,
    })
      .then((reponse) => reponse.json())
      .then((response) => {
        if (response.success) {
          var ticket = response.data;
          setSold(ticket);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  };

  // refresh the listing
  const Refresh = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var userId = await AsyncStorage.getItem("userId");
    setRefreshing(true);

    var APIUrl = Connection.url + Connection.boughtTickets + userId;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    await fetch(APIUrl, {
      method: "GET",
      headers: headers,
      signal: signal,
    })
      .then((reponse) => reponse.json())
      .then((response) => {
        if (response.success) {
          var ticket = response.data;
          setSold(ticket);
          setRefreshing(false);
        } else {
          setRefreshing(false);
        }
      })
      .catch((error) => {
        setRefreshing(false);
      });

    return () => {
      controller.abort();
    };
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

  // render ticket listing
  const renderItem = ({ item }) => (
    <TicketListing
      event={item.event_name}
      type={item.tickettype}
      quantity={item.quantity}
      price={item.price}
      iconName={TicketName(item.tickettype)}
      iconColor={TicketColor(item.tickettype)}
      status={item.status}
      textColor={StatusText(item.status)}
      onPress={() => navigation.navigate("BoughtDetail", { ...item })}
    />
  );

  //handle the work to be done when network is available
  useEffect(() => {
    if (connection) {
      FeatchTicket();
    }

    return () => {};
  }, [connection]);
  return (
    <View style={styles.container}>
      {logged ? (
        Internet ? (
          Loading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader size="small" />
            </View>
          ) : (
            <FlatList
              data={sold}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              onRefresh={Refresh}
              refreshing={refreshing}
              numColumns={2}
              ListEmptyComponent={
                <NoTicket
                  title="Purchased Tickets"
                  helperText="Purchased tickets are listed here!"
                />
              }
            />
          )
        ) : (
          <NoConnection onPress={() => setRetry(!retry)} />
        )
      ) : (
        <NotLoggedIn
          helpertext="You should have to login first to view your tickets"
          signUp={() => navigation.navigate("SignUp")}
          signIn={() => navigation.navigate("SignIn")}
        />
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  containertwo: {
    alignSelf: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 10,
    padding: 28,
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
