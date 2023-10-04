//import liraries

import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { AuthContext } from "../../Components/context";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";
import NotLoggedIn from "../../handlers/auth";
import NoTicket from "../../handlers/Tickets";
import NoConnection from "../../handlers/connection";
import TicketListing from "../../Components/Tickets/TicketsListing";
import { StatusText, TicketColor, TicketName } from "../../Utils/functions";
import Loader from "../../ui-components/ActivityIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
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

    const userId = await AsyncStorage.getItem("userId");
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
          setSold(response.data);
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

  //handle network state change
  useEffect(() => {
    const InternetConnection = async () => {
      const networkState = await NetInfo.fetch();
      setConnection(networkState.isConnected);
    };
    InternetConnection();

    const subscription = NetInfo.addEventListener(async (state) => {
      setConnection(state.isConnected);
    });
    return () => {
      subscription();
    };
  }, [retry]);

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
        connection ? (
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
                  title="No Purchased Ticket"
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
