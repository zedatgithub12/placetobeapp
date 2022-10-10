//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
import Connection from "../constants/connection";
import OrganizerEvents from "../Components/OrganizerEvents";
import { Caption } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import call from "react-native-phone-call";
import { AuthContext } from "../Components/context";
import OrganizersShimmer from "../Components/organizerShimmer";

// create a component
const OrganizersDetail = ({ route, navigation }) => {
  //parameters sent from event detail screen
  var { organizerInfo, followStatus } = route.params;

  // check wether user logged in or not
  // the state is store in the context and we are going to access it from context state
  const { userStatus } = React.useContext(AuthContext); //wether user is loged or not is retrieved from our context
  const logged = userStatus.logged;

  //image directory on the server
  var featuredImageUri = Connection.url + Connection.assets;
  var cover = "AddisAbeba.jpg";
  var coverpage = Connection.url + Connection.assets + cover;
  //organizer image in full screen
  const [modalVisible, setModalVisible] = useState(false);

  // state of organizer followers
  const [count, setCount] = useState(0);

  const followCounter = () => {
    var APIUrl = Connection.url + Connection.OrganizerFollowCounter;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var Data = {
      organizerId: organizerInfo.userId,
    };

    fetch(APIUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((response) => {
        var ServerResponse = response[0].message;

        if (ServerResponse === "succeed") {
          var followers = response[0].followers;
          setCount(followers);
        } else {
          setCount(0);
        }
      });
  };

  //state of follow unfollow operation
  const [follow, setFollow] = useState({
    subscription: followStatus,
    btnDisabled: false,
    ButtonColor: Constants.primary,
  });

  //follow organizer if user is not following
  //unfollow organizer if user is following

  const followOrganizer = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    let checkFollowing = true;
    var organizerId = organizerInfo.userId;
    var followerId = await AsyncStorage.getItem("userId");

    var APIUrl = Connection.url + Connection.follow;

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var Data = {
      organizerId: organizerId,
      followerId: followerId,
    };
    fetch(APIUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        let responseMessage = response[0].message;
        // effect subscription indicator
        if (checkFollowing) {
          if (responseMessage === "Following") {
            setFollow({
              ...follow,
              subscription: responseMessage,
              btnDisabled: true,
              ButtonColor: Constants.transparentPrimary,
            });
          } else {
            setFollow({
              ...follow,
              subscription: responseMessage,
              btnDisabled: false,
              ButtonColor: Constants.primary,
            });
          }
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("successfully aborted");
        } else {
          // handle error
          console.log("error abortion");
        }
      });
    return () => {
      // cancel the subscription
      checkFollowing = false;
      controller.abort();
    };
  };

  // does organizer have provided phone
  const [provided, setProvided] = useState(false);

  //make call to organizer
  const MakeCall = () => {
    const args = {
      number: organizerInfo.phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args);
  };

  // shimmer effect state
  const [loading, setLoading] = useState(false);
  //event flatlist related code
  const [events, setEvents] = useState();
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refStatus, setRefStatus] = React.useState("Refreshed"); //toast message to be shown when user pull to refresh the page

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
  const renderStatus = (startingDate, endingDate) => {
    var currentStatus;
    var Happening = "Happening";
    var Upcoming = "Upcoming";
    var Passed = "Passed";

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    if (
      startingDate == today ||
      (startingDate < today && endingDate >= today)
    ) {
      currentStatus = Happening;
    } else if (startingDate > today) {
      currentStatus = Upcoming;
    } else {
      currentStatus = Passed;
    }

    return currentStatus;
  };
  //render item to be displayed in the flatlist
  const renderItem = ({ item }) => (
    <OrganizerEvents
      Event_Id={item.event_id}
      status={renderStatus(item.start_date, item.end_date)}
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

     setLoading(false);
    // set refreshing state to true
    // featching abort controller
    // after featching events the fetching function will be aborted
    var organizerId = organizerInfo.userId;
    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.organizerEvents;

    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      userId: organizerId,
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
      .catch(()=>{
        setLoading(false);
      })

    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  };

  useEffect(() => {
    //check wether event organizer have phone number added to his account

    if (organizerInfo.phone != 0) {
      setProvided(true);
    } else {
      setProvided(false);
    }

    //fetch count of organizer number
    followCounter();
    RefreshList();
    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={{ uri: featuredImageUri + organizerInfo.profile }} //featured image source
              resizeMode="contain"
              style={styles.modalImage} //featured image styles
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

{loading ? (
  <View>
  <View style={styles.featuredImageContainer}>
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
  <Image
    //Featured Image of the event
    source={{ uri: coverpage }} //featured image source
    resizeMode="cover"
    style={styles.image} //featured image styles
    blurRadius={8}
  />
</View>

<View style={styles.sectionOne}>
  <TouchableOpacity
    onPress={() => setModalVisible(true)}
    style={styles.profileImageContainer}
  >
    <Image
      source={{ uri: featuredImageUri + organizerInfo.profile }} //featured image source
      resizeMode="cover"
      style={styles.profileImage} //featured image styles
    />
  </TouchableOpacity>
  <View style={styles.contentContainer}>
    <Text numberOfLines={1} style={styles.organizerName}>
      {organizerInfo.username}
    </Text>
    <Text>{organizerInfo.category}</Text>

    <View style={styles.followersContainer}>
      <Text style={styles.followerCount}>{count}</Text>
      <Caption style={styles.followerText}> Followers</Caption>
    </View>
  </View>
  <View
    //contaner of section two
    style={styles.sectionTwo}
  >
    {provided ? (
      <TouchableOpacity
        onPress={() => MakeCall()}
        activeOpacity={0.7}
        style={styles.callBtn}
      >
        <Text numberOfLines={1} style={styles.callText}>
          Call
        </Text>
      </TouchableOpacity>
    ) : null}

    {logged ? (
      <TouchableOpacity
        onPress={() => followOrganizer()}
        activeOpacity={0.7}
        style={styles.followBtn}
      >
        <Text numberOfLines={1} style={styles.btnText}>
          {follow.subscription}
        </Text>
      </TouchableOpacity>
    ) : null}
  </View>
</View>

<FlatList
  // List of events in extracted from database in the form JSON data
  data={events}
  renderItem={renderItem}
  keyExtractor={(item) => item.event_id}
  onRefresh={RefreshList}
  refreshing={refreshing}
  style={styles.eventList}
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
          You can add events using plus icon in the home page
        </HelperText>
      </View>
    ) : null
  }
/>
</View>
):(
<OrganizersShimmer/>
)
}

    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
   
  },
  backArrow: {
    position: "absolute",
    top: 5,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 38,
    marginBottom: 8,
    backgroundColor: Constants.background,
    height: 40,
    width: 40,
    borderRadius: 50,
    elevation: 2,
  },
  // Featurd Image style
  image: {
    width: "100%",
    height: 300,
    borderWidth: 2,
  },
  //featured Image Container Styling
  featuredImageContainer: {
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    height: 300,
    maxHeight: 300,
    marginTop: -30,
  },
  //View container of profile Image and organizer name and category
  sectionOne: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    marginTop: -80,
    backgroundColor: Constants.background,
    padding: 15,
    paddingHorizontal: 25,
    borderTopLeftRadius: Constants.borderRad,
    borderTopRightRadius: Constants.borderRad,
  },
  profileImageContainer: {
    width: "25%",
    height: 74,
    width: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.Faded,
    elevation: 4,
    shadowColor: Constants.Secondary,
  },
  profileImage: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  contentContainer: {
    marginLeft: 25,
    width: "40%",
  },
  organizerName: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    paddingLeft: 0,
  },
  followerCount: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
  },
  sectionTwo: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
  },
  followBtn: {
    width: 110,
    alignItems: "center",
    backgroundColor: Constants.PrimaryBlue,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: Constants.tinybox,
    margin: 10,
  },
  callBtn: {
    width: 105,
    alignItems: "center",
    backgroundColor: Constants.background,
    padding: 3,
    paddingHorizontal: 30,
    borderRadius: Constants.tinybox,
    borderWidth: 0.5,
    borderColor: Constants.PrimaryBlue,
  },
  btnText: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.background,
  },
  callText: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.PrimaryBlue,
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

  //modal for profile image to be shown in full screen size
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: "100%",
    height: 350,
    borderRadius: 10,
  },
  button: {
    alignSelf: "flex-end",
    borderRadius: Constants.borderRad,
    padding: 6,
    paddingHorizontal: 20,
    margin: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: Constants.Faded,
  },
  textStyle: {
    color: Constants.Danger,
    fontWeight: Constants.Bold,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  eventList: {
    marginBottom:300,
  }
});

//make this component available to the app
export default OrganizersDetail;
