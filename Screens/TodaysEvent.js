import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity
} from "react-native";
import Events from "../Components/Events";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import { HelperText } from "react-native-paper";
import Listing from "../Components/ListShimmer";


const TodaysEvents = ({ navigation }) => {
  const [events, setEvents] = useState();
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
//  const [refStatus, setRefStatus] = React.useState("Refreshed"); //toast message to be shown when user pull to refresh the page
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.TodayEvents;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    fetch(ApiUrl, {
      signal: signal,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        if (isApiSubscribed) {
          // handle success
          var message = response[0].message;
          if (message === "succeed") {
            var todayEvents = response[0].Events;
            setEvents(todayEvents);
            setNotFound(false);
            setLoading(true);
          } else if (message === "no event") {
            setEvents(todayEvents);
            setNotFound(true);
            setMessage("No event happening Today!");
            setLoading(true);
          } else {
            setLoading(true);
          }
        }
      })
      .catch((err) => {});
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
      controller.abort();
    };
  },[events]);

  /********************************************************** */
  //date function which perform date format conversion and return the suitable format for frontend
  /********************************************************** */
  const DateFun = (startingTime) => {
    var date = new Date(startingTime);
    let day = date.getDay();
    let month = date.getMonth();
    let happeningDay = date.getDate();

    // return weekname
    var weekday = new Array(7);
    weekday[1] = "Mon, ";
    weekday[2] = "Tue, ";
    weekday[3] = "Wed, ";
    weekday[4] = "Thu, ";
    weekday[5] = "Fri, ";
    weekday[6] = "Sat, ";
    weekday[0] = "Sun, ";

    //an array of month name
    var monthName = new Array(12);
    monthName[1] = "Jan";
    monthName[2] = "Feb";
    monthName[3] = "Mar";
    monthName[4] = "Apr";
    monthName[5] = "May";
    monthName[6] = "Jun";
    monthName[7] = "Jul";
    monthName[8] = "Aug";
    monthName[9] = "Sep";
    monthName[10] = "Oct";
    monthName[11] = "Nov";
    monthName[12] = "Dec";

    return weekday[day] + monthName[month + 1] + " " + happeningDay;
  };
  const TimeFun = (eventTime) => {
    var time = eventTime;
    var result = time.slice(0, 2);
    var minute = time.slice(3, 5);
    var globalTime;
    var postMeridian;
    var separator = ":";
    if (result > 12) {
      postMeridian = result - 12;
      globalTime = "PM";
    } else {
      postMeridian = result;
      globalTime = "AM";
    }

    return postMeridian + separator + minute + " " + globalTime;
  };
  const EntranceFee = (price) => {
    var eventPrice;
    var free = "Free";
    var currency = " ETB";
    if (price != 0) {
      eventPrice = price + currency;
    } else {
      eventPrice = free;
    }
    return eventPrice;
  };
  // render item in flatlist format
  const renderItem = ({ item }) => (
    <Events
      Event_Id={item.event_id}
      org_id={item.userId}
      FeaturedImage={item.event_image}
      title={item.event_name}
      date={DateFun(item.start_date)}
      time={TimeFun(item.start_time)}
      venue={item.event_address}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("EventDetail", { item })}
    />
  );
  //after the flatlist is refreshed we call this funtion
 // const refreshed = () => ToastAndroid.show(refStatus, ToastAndroid.SHORT);
  // refresh the flatlist item
  const RefreshList = () => {
    // set refreshing state to true
    setLoading(false);
    setRefreshing(true);
  
    // featching abort controller
    // after featching events the fetching function will be aborted

    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.TodayEvents;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    fetch(ApiUrl)
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        if (isApiSubscribed) {
          // handle success
          var message = response[0].message;

          if (message === "succeed") {
            var todayEvents = response[0].Events;
            setEvents(todayEvents);
            setNotFound(false);
            setRefreshing(false);
            setRefStatus("Refreshed");
         
            setLoading(true);
          } else if (message === "no event") {
            setEvents(todayEvents);
            setNotFound(true);
            setMessage("No event happening Today!");
            setRefStatus("Not refreshed retry");
            setLoading(true);
            setRefreshing(false);
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
      });

    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  };



  return (
    <View style={{minHeight: "100%",backgroundColor: Constants.background}}>


      {loading ? (
        <FlatList
          // List of events in extracted from database in the form JSON data
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.event_id}
          onRefresh={RefreshList}
          refreshing={refreshing}
          nestedScrollEnabled 
          // when ithere is no item to be listed in flatlist
          ListHeaderComponent={() =>
            notFound ? (
              <View style={styles.container}>
                <Image
                  source={require("../assets/NotFound.png")}
                  resizeMode="contain"
                  style={styles.notFound}
                />
                <Text style={styles.emptyMessageStyle}>{message}</Text>
                <HelperText style={{ alignSelf: "center" }}>
                  Check events of the week.
                </HelperText>
              </View>
            ) : null
          }
         
        />
      ) : (
        <View>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.background,
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
export default TodaysEvents;
