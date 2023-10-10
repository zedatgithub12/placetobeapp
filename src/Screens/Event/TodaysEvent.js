import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import Events from "../../Components/Events/Events";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";
import { HelperText } from "react-native-paper";
import Listing from "../../Components/Events/Skeleton/ListShimmer";
import {
  CategoryColor,
  DateFormater,
  EntranceFee,
  TimeFormater,
} from "../../Utils/functions";

const TodaysEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refStatus, setRefStatus] = React.useState("Refreshed"); //toast message to be shown when user pull to refresh the page
  const [loading, setLoading] = useState(false);

  // render item in flatlist format
  const renderItem = ({ item }) => (
    <Events
      Event_Id={item.id}
      org_id={item.userId}
      FeaturedImage={item.event_image}
      title={item.event_name}
      date={DateFormater(item.start_date)}
      time={TimeFormater(item.start_time)}
      venue={item.event_address}
      category={CategoryColor(item.category)}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("EventDetail", { id: item.id })}
    />
  );
  //after the flatlist is refreshed we call this funtion
  // const refreshed = () => ToastAndroid.show(refStatus, ToastAndroid.SHORT);
  // refresh the flatlist item
  const RefreshList = () => {
    // set refreshing state to true
    setLoading(false);
    setRefreshing(true);

    // after featching events the fetching function will be aborted

    var Api = Connection.url + Connection.TodayEvents;

    fetch(Api, {
      method: "GET",
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        if (response.success) {
          setEvents(response.data);
          setRefreshing(false);
          setRefStatus("Refreshed");
          setLoading(true);
        } else {
          setEvents([]);
          setLoading(true);
          setEvents(events);
          setRefreshing(false);
          setRefStatus("Retry");
        }
      })
      .catch((err) => {
        setEvents(events);
        setLoading(true);
      });
  };
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.TodayEvents;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    fetch(ApiUrl, {
      method: "GET",
      signal: signal,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        if (isApiSubscribed) {
          if (response.success) {
            setEvents(response.data);
            setLoading(true);
          } else {
            setLoading(true);
            setEvents([]);
            setMessage("No event happening Today!");
          }
        }
      })
      .catch((err) => {
        setLoading(true);
        setEvents(events);
      });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
      controller.abort();
    };
  }, []);
  return (
    <View
      style={{
        minHeight: "100%",
        paddingBottom: 60,
        backgroundColor: Constants.background,
      }}
    >
      {loading ? (
        events.map((item) => renderItem(item))
      ) : (
        <View>
          <Listing />
          <Listing />
          <Listing />
          <Listing />
          <Listing />
          <Listing />
          <Listing />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
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
    fontSize: Constants.headingthree,
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
export default TodaysEvents;
