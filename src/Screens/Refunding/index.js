//import liraries

import { useTheme } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoTicket from "../../handlers/Tickets";
import NetInfo from "@react-native-community/netinfo";
import NoConnection from "../../handlers/connection";
import PlacetobeCard from "../../Components/p2b-card";
import { Typography } from "../../themes/typography";
import Terms from "../../Utils/Terms";
import Constants from "../../constants/Constants";
import { P2bAnimatedBtn } from "../../ui-components/Button";
import Connection from "../../constants/connection";
import { AuthContext } from "../../Components/context";
import NotLoggedIn from "../../handlers/auth";

// create ticket refunding a component
const RefundingRequest = ({ navigation }) => {
  const { theme } = useTheme();
  const [reason, setReason] = useState("");
  const { userStatus } = useContext(AuthContext);
  const logged = false;
  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [sold, setSold] = useState([]);

  const FeatchTicket = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var userId = await AsyncStorage.getItem("userId");

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
        }
      })
      .catch((error) => {});

    return () => {
      controller.abort();
    };
  };

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
    <View
      style={[styles.container, { backgroundColor: theme.background.darker }]}
    >
      {logged ? (
        connection ? (
          <>
            <PlacetobeCard title="Ticket Info">
              <Text>Hey There</Text>
            </PlacetobeCard>
            <PlacetobeCard title="Refunding Reason">
              <TextInput
                placeholder="write here..."
                multiline
                value={reason}
                onChange={(text) => setReason(text)}
                style={{
                  minHeight: 4 * 30,
                  textAlignVertical: "top",
                  fontFamily: Typography.family,
                  fontSize: Typography.size.headingthree,
                  fontWeight: Typography.weight.medium,
                }}
              />
            </PlacetobeCard>
            <Terms />
            <P2bAnimatedBtn
              title="Submit Request"
              animation="fadeInUpBig"
              onPress={() => alert("submitting...")}
            />
          </>
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
  },
  ticketBtnContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    padding: 6,
  },
  buyticketbtn: {
    marginVertical: 6,
    alignSelf: "center",
    backgroundColor: Constants.primary,
    padding: 12,
    paddingHorizontal: 26,
    borderRadius: 8,
    justifyContent: "center",
    textAlign: "center",
    width: "94%",
  },
  ticketTxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    textAlign: "center",
    color: Constants.textColor,
  },
});

//make this component available to the app
export default RefundingRequest;
