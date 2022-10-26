//import liraries
import React, { Component, useState, useEffect, useRef } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../constants/Constants";
import YourE from "../Components/YourEvent";
import Connection from "../constants/connection";
import { HelperText } from "react-native-paper";
import { Ionicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrgShimmer from "../Components/orgShimmer";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

// create a component
const YourEvents = ({ route, navigation }) => {
  const { count } = route.params;

  const [events, setEvents] = useState();
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refStatus, setRefStatus] = React.useState("Refreshed"); //toast message to be shown when user pull to refresh the page
  const [loading, setLoading] = useState(false);

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
  //conditiional status filter
  const renderStatus = (eventStatus) => {
    var currentStatus;
    var Published = "Published";
    var Pending = "Pending";
    var declined = "Declined";

    if (eventStatus == 1) {
      currentStatus = Published;
    } else if (eventStatus == 2) {
      currentStatus = declined;
    } else {
      currentStatus = Pending;
    }

    return currentStatus;
  };
  //render item to be displayed in the flatlist
  const renderItem = ({ item }) => (
    <YourE
      Event_Id={item.event_id}
      status={renderStatus(item.event_status)}
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
  const refreshed = () => ToastAndroid.show(refStatus, ToastAndroid.SHORT);
  // refresh the flatlist item
  const RefreshList = async () => {
    var userId = await AsyncStorage.getItem("userId");
    setLoading(false);
    // featching abort controller
    // after featching events the fetching function will be aborted

    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.YourEvents;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      userId: userId,
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
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
            setMessage("Your event will be listed here.");
            setLoading(true);
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err)=>{
        setLoading(false);
      });

    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  };

  
  useEffect(() => {
    RefreshList();
    return () => {};
  }, []);

  return (
    <SafeAreaView
    
      style={styles.container}>
      <ScrollView 
       stickyHeaderIndices={[0]}
       
      >
        <View style={{backgroundColor: Constants.primary}}>
      <TouchableOpacity
        style={styles.backArrow} // back arrow button style
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-sharp"
          size={25}
          //back arrow icon
        />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.Title}>Your Events</Text>
        {loading ?
        (
<Text style={styles.eventCount}>{count}</Text>
        ):(
 <SkeletonPlaceholder>
   <View style={{width:45, height:30, borderRadius:3, padding:7}}/>
 </SkeletonPlaceholder>
        )

        }
        
      </View>
      </View>
{
  loading ?
  (
 <View >
    {
      events.map((item)=> <YourE
      key={item.event_id}
      Event_Id={item.event_id}
      status={renderStatus(item.event_status)}
      org_id={item.userId}
      FeaturedImage={item.event_image}
      title={item.event_name}
      date={DateFun(item.start_date)}
      time={TimeFun(item.start_time)}
      venue={item.event_address}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("EventDetail", { item })}
    />)
    }
</View>

  
  )
  :
  (
 <View>
   <OrgShimmer/>
   <OrgShimmer/>
   <OrgShimmer/>
   <OrgShimmer/>
   <OrgShimmer/>
   <OrgShimmer/>

   </View>
  )
}
</ScrollView>
        </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Constants.background,
  },
  backArrow: {
    position: "absolute",
    top: 10,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 4,
    
    backgroundColor: Constants.background,
    height: 40,
    width: 40,
    borderRadius: 50,
    elevation: 2,
  },
  headerContainer:{
   flexDirection:"row",
   justifyContent:"space-between",
   alignItems:"center",
   marginTop: 70,
   marginBottom: 25,
   paddingHorizontal:20,
  },
  Title: {

    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: 36,
    
  },
  eventCount: {
      backgroundColor:Constants.transparentPrimary,
      padding:5,
      paddingHorizontal:15,
      borderRadius:Constants.tiny,
      fontFamily: Constants.fontFam,
      fontWeight: Constants.Bold,
      fontSize: Constants.headingone,
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
  listEnd:{
    padding:20,
    backgroundColor:Constants.transparentPrimary,
    marginTop:5,
    margin:5,
    borderRadius:Constants.tinybox,
    marginBottom:62,
  }
});

//make this component available to the app
export default YourEvents;
