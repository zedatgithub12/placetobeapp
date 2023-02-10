import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Constants from "../constants/Constants";
import DetailContent from "../Components/EventContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../constants/connection";
import { AuthContext } from "../Components/context";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
import { bookmarkItem, remove } from "../Reducer/saveSlice";
import Share from "react-native-share";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import * as Animatable from "react-native-animatable";
import DetailShimmer from "../Components/DetailShimmer";
import MapView, {
  PROVIDER_GOOGLE,
  GoogleMaps,
  Callout,
} from "react-native-maps";
// import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

const EventDetails = ({ route, navigation }) => {
  const params = route.params || {};
  const { id, externalLink } = params; // an event item received from homepage flatlist will passed to this screen through route params
  const { userStatus } = React.useContext(AuthContext); //wether user is loged or not is retrieved from our context
  const logged = userStatus.logged;
  //dispatch bookmarking item
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  //item as value from database
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);

  // const date = new Date();
  // var hour = date.getHours();
  // var minute = date.getMinutes();

  // var Timing = hour + ":" + minute;

  const [timing, setTime] = useState({
    StartTime: "",
    EndTime: "",
  });
  /********************************************** */
  // the method  which checks the existance of event address coordinates and
  // update the state to show or hide event address map
  /******************************************** */
  const [coords, setCoords] = useState(true);

  const checkCoords = (latlng) => {
    if (latlng.address_latitude == 0 && latlng.address_longitude == 0) {
      setCoords(false);
    }
  };

  /******************************************** */
  //let fetch event detail from database and we access the value returned in the json format
  //and distrube it through the scree
  /****************************************** */

  const FeatchEvent = () => {
    if (externalLink) {
      setLoading(true);
      var ApiUrl = Connection.url + Connection.Event;
      //organizer id is the only data to be sent to server in order to retrive organizer data
      var Data = {
        eventId: externalLink,
      };
      // header type for text data to be send to server
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          let message = response[0].message;
          let event = response[0].event;
          let startTime = response[0].StartTime;
          let EndTime = response[0].EndTime;
          var start = TimeFun(startTime);
          var end = TimeFun(EndTime);

          if (message === "succeed") {
            setItem(event);
            setTime({
              ...timing,
              StartTime: start,
              EndTime: end,
            });
            setLoading(false);
            checkCoords(event);
          } else {
            //setLoading(true);
            console.log("There is miss understanding with backend iternal");
          }
        })
        .catch((error) => {
          //setLoading(true);
          console.log(
            "Error: there is miss understanding with backend" + error
          );
        });
    } else {
      setLoading(true);
      var ApiUrl = Connection.url + Connection.Event;
      //organizer id is the only data to be sent to server in order to retrive organizer data
      var Data = {
        eventId: id,
      };
      // header type for text data to be send to server
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          let message = response[0].message;
          let event = response[0].event;
          let startTime = response[0].StartTime;
          let EndTime = response[0].EndTime;
          var start = TimeFun(startTime);
          var end = TimeFun(EndTime);

          if (message === "succeed") {
            setItem(event);

            setTime({
              ...timing,
              StartTime: start,
              EndTime: end,
            });

            setLoading(false);
            checkCoords(event);
          } else {
            //setLoading(true);
            console.log("There is miss understanding with backend");
          }
        })
        .catch((error) => {
          //setLoading(true);
          console.log("Error: there is miss understanding with backend");
        });
    }
  };
  // featuredImage asset location on the server
  var featuredImageUri = Connection.url + Connection.assets;

  /********************* */
  // event bookmarking related code is writen below
  /********************* */

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT); //message to be toasted after user clicked the bookmark button
  };

  const [bookmarkBtn, setBookmarkBtn] = useState(false);
  const [bookmarkBtnColor, setBookmarkBtnColor] = useState(Constants.Inverse);

  const bookmarkEvent = () => {
    const find = items.find((event) => event.event_id === item.event_id);
    if (find) {
      //setBookmarkBtn(true);
      setBookmarkBtnColor(Constants.Secondary);
      dispatch(remove(item.event_id));
      showToast("Unsaved!");
    } else {
      dispatch(bookmarkItem(item));
      // setBookmarkBtn(true);
      setBookmarkBtnColor(Constants.primary);
      showToast("Saved!");
    }
  };
  //check bookmarked button state

  const bookmarked = () => {
    var yesItis = false;
    const find = items.find((event) => event.event_id === id);
    if (find) {
      //setBookmarkBtn(true);
      setBookmarkBtnColor(Constants.primary);
      yesItis = true;
      return yesItis;
    }
    return yesItis;
  };

  // alert when user doesn't logged into the system
  const SignInAlert = () =>
    Alert.alert("Bookmark", "SignIn first to bookmark the event!", [
      {
        text: "Cancel",

        style: "cancel",
      },
      {
        text: "SignIn",
        onPress: () => navigation.navigate("SignIn"),
        style: styles.signInBtn,
      },
    ]);

  /******************************************* */
  //event Sharing functionality related code is writen below
  /******************************************* */
  const ShareEvent = async (eventId) => {
    let remoteUrl = featuredImageUri + item.event_image; //file path on the server
    let event_image = item.event_image; //name of image to be shared

    let localPath = `${FileSystem.cacheDirectory}${event_image}`; //cached file url
    FileSystem.downloadAsync(remoteUrl, localPath); //download file to cached directory

    const doesExist = await FileSystem.getInfoAsync(localPath);

    var weblink = Constants.webLink;
    // var urlAddress = Connection.url+"/"+Connection.Event+"/"+eventId;
    const shareOptions = {
      url: localPath,
      title: item.event_name,
      message: "Check out this event on Place to be Ethiopia" + " " + weblink,
    };

    await Share.open(shareOptions).catch((err) => {});
  };
  /********************************************* */
  //event start date time and end date related code is writen below
  /********************************************* */

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

  /********************************************** */
  //read more description button related code  is writen below
  /******************************************** */
  const [read, setRead] = useState(5);
  const [readMorebtn, setReadMorebtn] = useState(false);
  const [textLength, setTextLength] = useState(read);

  const onTextLayout = React.useCallback((e) => {
    const lineLength = e.nativeEvent.lines.length; // get text line count

    if (lineLength > read) {
      setTextLength(lineLength);
      setReadMorebtn(true);
    }
  }, []);

  const [descLength, setDescLength] = useState("Read More");
  const showmore = () => {
    if (textLength > read) {
      setRead(textLength);
      setReadMorebtn(false);
      setDescLength("Read Less");
    } else {
      setRead(5);
      setReadMorebtn(false);
      setDescLength("Read More");
    }
  };

  /********************************************* */
  //event organizer related code is writen below
  /****************************************** */
  const [organizerInfo, setOrganizerInfo] = useState();
  var profile = "maleProfile.jpg"; // user profile placeholder
  const [eventOrg, setEventOrg] = useState({
    featuredImage: profile,
    organizerName: "Organizer",
    category: "Category",
  });

  /******************************************************************** */
  // when user scroll organizer information will be fetched from the server
  /******************************************************************* */
  // fetch event organizer from database
  const [followStatus, setFollowStatus] = useState();
  const [featching, setFetching] = useState(false);

  const featchOrganizer = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    let featchOrganizer = true;
    var followerId = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.organizer;
    //organizer id is the only data to be sent to server in order to retrive organizer data

    var Data = {
      eventId: id,
      followerId: followerId,
    };
    // header type for text data to be send to server
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        let message = response[0].message;
        let follow = response[0].follow;
        let profile = response[0].profile;

        if (featchOrganizer) {
          if (message === "succeed") {
            setEventOrg({
              ...eventOrg,
              featuredImage: profile.profile,
              organizerName: profile.username,
              category: profile.category,
            });
            setOrganizerInfo(profile);
            setFetching(true);
          } else {
            // code goes here if you have something to return on negetive return
          }
          if (follow === "Following") {
            setFollow({
              ...follow,
              subscription: follow,
              btnDisabled: true,
              ButtonColor: Constants.transparentPrimary,
            });
            setFollowStatus(follow);
          } else {
            setFollow({
              ...follow,
              subscription: follow,
              btnDisabled: false,
              ButtonColor: Constants.primary,
            });
            setFollowStatus(follow);
          }
        }
      });
    return () => {
      // cancel the subscription
      featchOrganizer = false;
      controller.abort();
    };
  };
  /********************************************************************* */
  //user follow unfollow related code is writen below
  /******************************************************************** */
  const [follow, setFollow] = useState({
    subscription: "Follow",
    btnDisabled: false,
    ButtonColor: Constants.primary,
  });

  const [followProgress, setFollowProgress] = useState(false);

  const followOrganizer = async () => {
    setFollowProgress(true);

    const controller = new AbortController();
    const signal = controller.signal;

    let checkFollowing = true;
    var organizerId = item.userId;
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
            setFollowProgress(false);
            setFollowStatus(responseMessage);
          } else {
            setFollow({
              ...follow,
              subscription: responseMessage,
              btnDisabled: false,
              ButtonColor: Constants.primary,
            });
            setFollowStatus(responseMessage);
            setFollowProgress(false);
          }
        }
      });

    return () => {
      // cancel the subscription
      checkFollowing = false;
      controller.abort();
    };
  };

  /************************************************************* */
  //Fetch tickets from database
  /************************************************************* */
  const [tickets, setTickets] = useState();
  const [exist, setExist] = useState(false);

  const FeatchTickets = () => {
    if (externalLink) {
      const controller = new AbortController();
      const signal = controller.signal;

      var ApiUrl = Connection.url + Connection.eventTicket;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };
      var Data = {
        eventId: externalLink,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          var message = response[0].message;
          var eventTickets = response[0].tickets;
          if (message === "succeed") {
            setTickets(eventTickets);
            setExist(true);
          } else if (message === "no tickets") {
            setTickets(eventTickets);
            setExist(false);
          } else {
            setTickets();
            setExist(false);
          }
        })
        .catch((error) => {
          setExist(false);
        });

      return () => {
        controller.abort();
      };
    } else {
      const controller = new AbortController();
      const signal = controller.signal;

      var ApiUrl = Connection.url + Connection.eventTicket;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };
      var Data = {
        eventId: id,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          var message = response[0].message;
          var eventTickets = response[0].tickets;
          if (message === "succeed") {
            setTickets(eventTickets);
            setExist(true);
          } else if (message === "no tickets") {
            setTickets(eventTickets);
            setExist(false);
          } else {
            setTickets();
            setExist(false);
          }
        })
        .catch((error) => {
          setExist(false);
        });

      return () => {
        controller.abort();
      };
    }
  };

  const [orders, setOrders] = useState({
    first: false,
    second: false,
  });

  //we call useeffect hook once the component get mounted
  useEffect(() => {
    var isSubcribed = true;
    if (isSubcribed) {
      FeatchEvent();
      FeatchTickets();
      bookmarked();
      featchOrganizer();
    }
    return () => {
      isSubcribed = false;
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Constants.background }}>
      {loading ? (
        <View>
          <DetailShimmer />
        </View>
      ) : (
        <ScrollView
          scrollEventThrottle={16}
          style={{ backgroundColor: Constants.background }}
        >
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

              source={{ uri: featuredImageUri + item.event_image }} //featured image source
              resizeMode="cover"
              style={styles.image} //featured image styles
            />
          </View>

          {item.cancelled === "1" ? (
            <Animatable.View
              animation="slideInDown"
              style={styles.eventGotCancelled}
            >
              <MaterialCommunityIcons
                name="cancel"
                size={18}
                color={Constants.Danger}
                style={{ marginLeft: 6 }}
              />
              <Text style={styles.cancelledText}>Cancelled Event</Text>
            </Animatable.View>
          ) : null}

          <View style={styles.EventTitle}>
            <Text
              numberOfLines={1}
              style={[styles.eventName]} // event name on event detail section
            >
              {item.event_name}
            </Text>

            <View style={styles.actionButton}>
              {logged && bookmarked ? (
                <TouchableOpacity
                  //bookmark button beside event title
                  disabled={bookmarkBtn}
                  activeOpacity={0.7}
                  style={styles.bookmarkButton}
                  onPress={() => bookmarkEvent()}
                >
                  <Ionicons
                    name="bookmark"
                    size={18}
                    color={bookmarkBtnColor}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  //bookmark button beside event title
                  activeOpacity={0.7}
                  style={styles.bookmarkButton}
                  onPress={() => SignInAlert()}
                >
                  <Ionicons
                    name="bookmark"
                    size={18}
                    color={bookmarkBtnColor}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.sharekButton}
                activeOpacity={0.7}
                onPress={() => ShareEvent(item.event_id)}

                // share event button
              >
                <Entypo name="share" size={18} style={styles.shareIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <DetailContent
            StartDate={DateFun(item.start_date)}
            StartTime={timing.StartTime}
            EndDate={DateFun(item.end_date)}
            EndTime={timing.EndTime}
            Price={item.event_entrance_fee}
            Venues={item.event_address}
            phone={item.contact_phone}
          />
          <View style={styles.descDescription}>
            <Text style={styles.descTitle}> Description</Text>

            <Text
              style={styles.desctext}
              numberOfLines={read}
              onTextLayout={onTextLayout}
            >
              {item.event_description}
            </Text>
            {readMorebtn ? (
              <TouchableOpacity activeOpacity={0.7} onPress={() => showmore()}>
                <Text style={styles.ReadMore}>{descLength}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {coords ? (
            <View style={styles.mapContainer}>
              <View style={styles.mapInfo}>
                <Text style={styles.location}>Location</Text>
                <Text style={styles.venueOnMap} numberOfLines={1}>
                  {item.event_address}
                </Text>
              </View>
              <MapView
                provider={PROVIDER_GOOGLE}
                mapType="standard"
                userInterfaceStyle="dark"
                minZoomLevel={16}
                maxZoomLevel={20}
                loadingEnabled={true}
                loadingBackgroundColor={Constants.Faded}
                loadingIndicatorColor={Constants.primary}
                tintColor={Constants.primary}
                userLocationCalloutEnabled={true}
                style={[styles.map]}
                initialRegion={{
                  latitude: parseFloat(item.address_latitude),
                  longitude: parseFloat(item.address_longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(item.address_latitude),
                    longitude: parseFloat(item.address_longitude),
                  }}
                  image={{
                    uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Dmap%2BMarker&psig=AOvVaw1sWuU_lBSs-5sii34I1Nz_&ust=1676116422134000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCLDxkLXyiv0CFQAAAAAdAAAAABAF",
                  }}
                />
                <Callout tooltip={true} />
              </MapView>
            </View>
          ) : null}

          {featching ? (
            <View
              style={styles.organizersSection}
              //organizers section container, which contains
              // Organizers profile, name, Category and subscription button
            >
              <Pressable
                onPress={() =>
                  navigation.navigate("Organizer Detail", {
                    organizerInfo,
                    followStatus,
                  })
                }
              >
                <Image
                  source={{ uri: featuredImageUri + eventOrg.featuredImage }}
                  style={styles.organizerProfile}
                  resizeMode="contain"
                />
              </Pressable>
              <Pressable
                // organizers name and operation category will be listed inside this component
                style={styles.orgInfoContainer}
                onPress={() =>
                  navigation.navigate("Organizer Detail", {
                    organizerInfo,
                    followStatus,
                  })
                }
              >
                <Text style={styles.orgName}>{eventOrg.organizerName}</Text>
                <Text
                  style={styles.orgCategory} //organizers operation field or category
                >
                  {eventOrg.category}
                </Text>
              </Pressable>
              {logged ? (
                <TouchableOpacity
                  // follow organizers button

                  activeOpacity={0.6}
                  style={[
                    styles.orgFollowBtn,
                    { backgroundColor: follow.ButtonColor },
                  ]}
                  onPress={() => followOrganizer()}
                >
                  {followProgress ? (
                    <ActivityIndicator
                      size="small"
                      color={Constants.background}
                    />
                  ) : (
                    <Text style={styles.orgFollowTxt}>
                      {follow.subscription}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}
              {/* <MapView style={styles.map} /> */}
            </View>
          ) : (
            <SkeletonPlaceholder>
              <View style={styles.orgConatinerShimmer}>
                <View style={styles.orgProfileShimmer} />
                <View style={styles.orgNameShimmer} />
                <View style={styles.orgCategoryShimmer} />
                <View style={styles.orgButtonShimmer} />
              </View>
            </SkeletonPlaceholder>
          )}
        </ScrollView>
      )}
      {exist ? (
        <Animatable.View
          animation="fadeInUpBig"
          style={[styles.ticketBtnContainer]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("TicketScreen", { item })}
            style={styles.buyticketbtn}
          >
            <Text style={styles.ticketTxt}> Buy Ticket</Text>
          </TouchableOpacity>
        </Animatable.View>
      ) : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: 5,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: Constants.background,
    height: 40,
    width: 40,
    borderRadius: 50,
    elevation: 2,
  },
  // Featurd Image style
  image: {
    flex: 1,
    width: "100%",
    height: 350,

    borderWidth: 2,
    borderRadius: 20,
  },
  //featured Image Container Styling
  featuredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "96%",
    height: "90%",
  },

  // organizers section styling
  organizersSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  //organizers profile styling
  organizerProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: Constants.primary,
  },
  //organizer information section style
  orgInfoContainer: {
    justifyContent: "center",
    alignSelf: "center",
  },
  // organizer name style
  orgName: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Boldtwo,
    color: Constants.mainText,
    marginTop: 2,
  },
  // organizer operation category style
  orgCategory: {
    fontWeight: Constants.Boldtwo,
    color: Constants.mainTwo,
    alignSelf: "center",
  },
  // follow button style
  orgFollowBtn: {
    width: 130,
    borderRadius: Constants.tiny,
    padding: Constants.padd,
    paddingHorizontal: 20,
    margin: 10,
    marginBottom: 70,
  },
  // follow button text style
  orgFollowTxt: {
    color: Constants.textColor,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    textAlign: "center",
  },
  eventGotCancelled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 7,
    backgroundColor: Constants.lightRed,
    padding: 8,
    borderTopEndRadius: Constants.borderRad,
  },
  cancelledText: {
    color: Constants.red,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
    fontStyle: "italic",
    marginHorizontal: 5,
    paddingRight: 5,
  },
  EventTitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    paddingLeft: 10,
  },
  actionButton: {
    position: "absolute",
    right: 5,
    top: 0,
    width: "20%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  eventName: {
    width: "79%",
    marginTop: 5,
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,

    paddingRight: 4,
  },
  bookmarkButton: {
    borderRadius: 50,
    padding: 8,
    margin: 5,
    backgroundColor: Constants.Faded,
  },
  bookmarkIcon: {},
  sharekButton: {
    borderRadius: 50,
    padding: 8,
    margin: 5,
    backgroundColor: Constants.Faded,
  },
  descDescription: {
    flex: 2,
    margin: 10,
    marginLeft: 20,
  },
  descTitle: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    paddingLeft: 2,
  },
  desctext: {
    margin: 5,
    marginLeft: 10,
    fontFamily: Constants.fontFam,
    fontSize: 14,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "98%",
    height: 450,
    paddingTop: 5,
  },
  mapInfo: {
    flexDirection: "column",
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginVertical: 10,
  },
  location: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  venueOnMap: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.thirty,
    color: Constants.Inverse,
  },
  map: {
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 6,
  },

  ticketBtnContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: Constants.Faded,
  },
  buyticketbtn: {
    marginVertical: 6,
    alignSelf: "center",
    backgroundColor: Constants.primary,
    padding: 10,
    paddingHorizontal: 26,
    borderRadius: 8,
    justifyContent: "center",
    textAlign: "center",
  },
  ticketTxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    textAlign: "center",
    color: Constants.textColor,
  },
  ReadMore: {
    fontWeight: Constants.Bold,
    color: Constants.purple,
    padding: 6,
    marginLeft: 6,
    fontStyle: "italic",
  },
  orgConatinerShimmer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  orgProfileShimmer: {
    backgroundColor: Constants.Faded,
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  orgNameShimmer: {
    backgroundColor: Constants.Faded,
    padding: 10,
    width: 140,
    borderRadius: Constants.tiny,
    marginTop: 8,
  },
  orgCategoryShimmer: {
    backgroundColor: Constants.Faded,
    padding: 6,
    width: 100,
    borderRadius: Constants.tiny,
    marginTop: 7,
  },
  orgButtonShimmer: {
    backgroundColor: Constants.Faded,
    padding: 12,
    width: 100,
    borderRadius: Constants.tinybox,
    marginTop: 12,
    marginBottom: 15,
  },
  signInBtn: {
    borderRadius: Constants.tiny,
    padding: Constants.padd,
    paddingHorizontal: 20,
    margin: 10,
  },
});
export default EventDetails;
