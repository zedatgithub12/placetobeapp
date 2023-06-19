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
import Constants from "../../constants/Constants";
import YourE from "../../Components/Events/YourEvent";
import Connection from "../../constants/connection";
import { HelperText } from "react-native-paper";
import { Ionicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrgShimmer from "../../Components/Organizers/Skeleton/orgShimmer";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

// create a component
const YourEvents = ({ navigation }) => {
  const [load, setLoad] = React.useState(false);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

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

  const RefreshList = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var userId = await AsyncStorage.getItem("userId");
    setLoading(false);
    // featching abort controller
    // after featching events the fetching function will be aborted
    var ApiUrl = Connection.url + Connection.YourEvents + userId;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        if (response.success) {
          var todayEvents = response.data;
          setEvents(todayEvents);
          setLoading(true);
        } else {
          setMessage("Your event will be listed here.");
          setLoading(true);
        }
      })
      .catch((err) => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  };

  //render item to be displayed in the flatlist
  const renderItem = ({ item }) => (
    <YourE
      Event_Id={item.id}
      status={renderStatus(item.event_status)}
      org_id={item.userId}
      FeaturedImage={item.event_image}
      title={item.event_name}
      date={DateFun(item.start_date)}
      time={TimeFun(item.start_time)}
      venue={item.event_address}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("YoursDetail", { item })}
    />
  );

  const featchUserInformation = async () => {
    const Controller = new AbortController();
    const Signal = Controller.signal;

    var fetchIt = true;
    var id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.userInfo + id;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
      signal: Signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (fetchIt) {
          if (response.success) {
            var eventPostedCount = response.events;
            setCount(eventPostedCount);
            setLoad(false);
          } else {
            setLoad(false);
          }
        }
      })
      .catch((err) => {
        setLoad(false);
      });
    return () => {
      fetchIt = false;
      Controller.abort();
    };
  };
  useEffect(() => {
    RefreshList();
    featchUserInformation();

    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
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
          {loading ? (
            <Text style={styles.eventCount}>{count}</Text>
          ) : (
            <SkeletonPlaceholder>
              <View
                style={{ width: 45, height: 30, borderRadius: 3, padding: 7 }}
              />
            </SkeletonPlaceholder>
          )}
        </View>
      </View>
      {loading ? (
        <FlatList
          // List of events in extracted from database in the form JSON data
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onRefresh={RefreshList}
          refreshing={refreshing}
          // when ithere is no item to be listed in flatlist
          ListEmptyComponent={
            <View style={styles.container}>
              <Image
                source={require("../../assets/images/NotFound.png")}
                resizeMode="contain"
                style={styles.notFound}
              />
              <Text style={styles.emptyMessageStyle}>{message}</Text>
              <HelperText style={{ alignSelf: "center" }}>
                You can add events using plus icon in the home page
              </HelperText>
            </View>
          }
        />
      ) : (
        <View>
          <OrgShimmer />
          <OrgShimmer />
          <OrgShimmer />
          <OrgShimmer />
          <OrgShimmer />
          <OrgShimmer />
        </View>
      )}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Faded,
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  Title: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.primaryHeading,
  },
  eventCount: {
    backgroundColor: Constants.transparentPrimary,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: Constants.tiny,
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
export default YourEvents;
