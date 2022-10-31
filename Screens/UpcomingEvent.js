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

const UpcomingEvents = ({ navigation }) => {
   const [UEvents, setUEvents] = useState();
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refStatus, setRefStatus] =React.useState("Refreshed"); //toast message to be shown when user pull to refresh the page 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.UpcomingEvents;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    fetch(ApiUrl, {
      signal: signal,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        var message = response[0].message;

        if (isApiSubscribed) {
         
          var UpcomingEvents = response[0].Events;
          
          if (message === "succeed") {
             // handle success
            setUEvents(UpcomingEvents);
            setNotFound(false);
            setLoading(true);
          } else if (message === "no event") {
            setUEvents(UpcomingEvents);
            setNotFound(true);
            setMessage("No upcoming events!");
            setLoading(true);
          } else {
            setLoading(true);
            setUEvents(UEvents);
          }
        }
      })
      .catch((err) => {
        setLoading(true);
        setUEvents(UEvents);
      });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
      controller.abort();
    };
  },[]);

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
  const CategoryColor = (category) => {
    var color;
    switch (category) {
      case "Entertainment":
        color = "#a11295";
        break;
      case "Travelling":
        color = "#129ca1";
        break;
    
      case "Cinema & Theater":
        color = "#5ca803";
        break;

      case "Community":
        color = "#F96666";
        break;
      case "Trade Fairs & Expo":
        color = "#E38B29";
        break;
      case "Nightlife":
        color = "#472D2D";
        break;
      case "Professional":
        color = "#002B5B";
        break;
      case "Shopping":
        color = "#9306c2";
        break;
      case "Sport":
        color = "#576F72";
        break;
      case "Others":
        color = "#967E76";
        break;
      default:
        color = "#ffbb00";
    }
    return color;
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
      category={CategoryColor(item.category)}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("EventDetail", { item })}
    />
  );
  //after the flatlist is refreshed we call this funtion
 // const refreshed = () => ToastAndroid.show(refStatus, ToastAndroid.SHORT);
  // refresh the flatlist item

  const RefreshList = () => {
    // set refreshing state to true
    setRefreshing(true);
    
    //set Shimmer effect apperance to true
    setLoading(false);
    // featching abort controller
    // after featching events the fetching function will be aborted

    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.UpcomingEvents;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    fetch(ApiUrl)
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        var message = response[0].message;

        if (isApiSubscribed) {
          // handle success
          var UpcomingEvents = response[0].Events;
          if (message === "succeed") {
            setUEvents(UpcomingEvents);
            setNotFound(false);
            setRefreshing(false);
            setRefStatus("Refreshed");
            setLoading(true);
          } else if (message === "no event") {
            setUEvents(UpcomingEvents);
            setNotFound(true);
            setMessage("No upcoming events!");
            setRefStatus("Not refreshed retry");
            setRefreshing(false);
            setLoading(true);
          } else {
            setLoading(true);
            setUEvents(UEvents);
          }
        }
      })
      .catch((err) =>{
        setLoading(true);
        setUEvents(UEvents);
      })
      
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  };

  return (

    <View style={{minHeight: "100%", backgroundColor: Constants.background}}>
      {loading ? (
        <FlatList
      // List of events in extracted from database in the form JSON data
      data={UEvents}
      renderItem={renderItem}
      keyExtractor={(item) => item.event_id}
      onRefresh={RefreshList}
      refreshing={refreshing}
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
              
            </HelperText>
          </View>
        ) : null
      }
    
      
    />
      )

      :
      (
        <View>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        <Listing/>
        </View>
      )

      }
    </View>
    
  );
};
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Constants.background,
    alignItems: "center",
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
    alignSelf:"center"
  },
  emptyMessageStyle: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.Secondary,

    alignSelf: "center",
    justifyContent: "center",
  },
  listEnd:{
    padding:20,
    backgroundColor:Constants.transparentPrimary,
    marginTop:5,
    margin:5,
    borderRadius:Constants.tinybox,
    marginBottom:62,
  }
});
export default UpcomingEvents;
