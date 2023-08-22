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
import { AuthContext } from "../../Components/context";
import NotLoggedIn from "../../handlers/auth";
import Connection from "../../api";
import { showToast } from "../../Utils/Toast";
import Loader from "../../ui-components/ActivityIndicator";

// create ticket refunding a component
const RefundingRequest = () => {
  const { theme } = useTheme();
  const [reason, setReason] = useState("");
  const { ticketid } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [sold, setSold] = useState();

  const FeatchTicket = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    var userId = await AsyncStorage.getItem("userId");

    var APIUrl =
      Connection.url +
      Connection.singleTicket +
      userId +
      `?ticketid=${ticketid}`;
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
          showToast("Retry later");
          setLoading(false);
        }
      })
      .catch((error) => {
        showToast("Error retriving ticket");
        setLoading(false);
      });

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

  const handleSubmit = async () => {
    var userId = await AsyncStorage.getItem("userId");
    setSubmitting(true);
    const controller = new AbortController();
    const signal = controller.signal;

    var APIUrl = Connection.url + Connection.requestRefunding;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const data = {
      ticket_id: sold.ticketid,
      user_id: userId,
      event_id: sold.event_id,
      refund_reason: reason,
      quantity: sold.quantity,
      price: sold.price,
    };

    fetch(APIUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      signal: signal,
    })
      .then((reponse) => reponse.json())
      .then((response) => {
        if (response.success) {
          showToast(response.message);
          setSubmitting(false);
        } else {
          showToast(response.message);
          setSubmitting(false);
        }
      })
      .catch((error) => {
        showToast("Error submitting request");
        setSubmitting(false);
      });

    return () => {
      controller.abort();
    };
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.darker }]}
    >
      {connection ? (
        loading ? (
          <Loader size="large" />
        ) : sold ? (
          <>
            <PlacetobeCard title="Ticket Info">
              <View style={styles.secondcontents}>
                <Text style={styles.leftside}>Ticket Name</Text>
                <Text style={styles.rightside}>{sold.event_name}</Text>
              </View>
              <View style={styles.secondcontents}>
                <Text style={styles.leftside}>Type</Text>
                <Text style={styles.rightside}>{sold.tickettype}</Text>
              </View>
              <View style={styles.secondcontents}>
                <Text style={styles.leftside}>Quantity</Text>
                <Text style={styles.rightside}>{parseInt(sold.quantity)}</Text>
              </View>
              <View style={styles.secondcontents}>
                <Text style={styles.leftside}>Total</Text>
                <Text style={styles.rightside}>
                  {parseInt(sold.quantity) * parseInt(sold.price)} Birr
                </Text>
              </View>
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
              isSubmitting={submitting}
              onPress={() => handleSubmit()}
            />
          </>
        ) : (
          <NoTicket
            title="You don't have upcoming event tickets"
            helpertext=""
          />
        )
      ) : (
        <NoConnection onPress={() => setRetry(!retry)} />
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  secondcontents: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginVertical: 8,
  },
  leftside: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
  },
  rightside: {
    textTransform: "capitalize",
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
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
