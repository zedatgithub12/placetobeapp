import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  ToastAndroid,
  Dimensions,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  SimpleLineIcons,
  AntDesign,
} from "react-native-vector-icons";
import Constants from "../../constants/Constants";
import DetailContent from "../../Components/Events/EventContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../../constants/connection";
import { AuthContext } from "../../Components/context";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
import { bookmarkItem, remove } from "../../Reducer/saveSlice";
import Share from "react-native-share";
import call from "react-native-phone-call";
import * as Animatable from "react-native-animatable";
import DetailShimmer from "../../Components/Events/Skeleton/DetailShimmer";
import MapView, { PROVIDER_GOOGLE, Callout } from "react-native-maps";
// import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { useTheme } from "@react-navigation/native";
import Rating from "../../Components/Events/Rating";
import RelatedEvent from "../../Components/Events/related";
import { Typography } from "../../themes/typography";

const EventDetails = ({ route, navigation }) => {
  const { theme } = useTheme();
  const params = route.params || {};
  const { id, externalLink } = params; // an event item received from homepage flatlist will passed to this screen through route params
  const { userStatus } = React.useContext(AuthContext); //wether user is loged or not status is retrieved from our context
  const logged = userStatus.logged;
  //dispatch bookmarking item
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  //item as value from database
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);

  const MakeCall = (phone) => {
    const args = {
      number: phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args);
  };

  const Rated = (value) => {
    setCurrentRating(value);
    setRatingVisible(true);
  };

  const handleRatingClose = () => {
    setRatingVisible(false);
  };

  const handleSubmitFeedback = (rating, review) => {
    // Make API call to store the feedback
    console.log("Submitting feedback:", rating, review);
  };

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
    var latitude = latlng.address_latitude;
    var longitude = latlng.address_latitude;

    if (latitude == null && longitude == null) {
      setCoords(false);
    }
  };

  /******************************************** */
  //let fetch event detail from database and we access the value returned in the json format
  //and distrube it through the scree
  /****************************************** */

  const FeatchEvent = () => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (externalLink) {
      setLoading(true);
      var ApiUrl = Connection.url + Connection.Event + externalLink;

      // header type for text data to be send to server
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      fetch(ApiUrl, {
        method: "GET",
        headers: headers,
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            let event = response.data;
            let startTime = response.StartTime;
            let EndTime = response.EndTime;
            var start = TimeFun(startTime);
            var end = TimeFun(EndTime);
            setItem(event);
            setTime({
              ...timing,
              StartTime: start,
              EndTime: end,
            });
            setLoading(false);
            checkCoords(event);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(
            "Error: there is miss understanding with backend" + error
          );
        });
    } else {
      setLoading(true);
      var ApiUrl = Connection.url + Connection.Event + id;
      //organizer id is the only data to be sent to server in order to retrive organizer data

      // header type for text data to be send to server
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      fetch(ApiUrl, {
        method: "GET",
        headers: headers,
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            let event = response.data;
            let startTime = response.StartTime;
            let EndTime = response.EndTime;
            var start = TimeFun(startTime);
            var end = TimeFun(EndTime);
            setItem(event);
            setTime({
              ...timing,
              StartTime: start,
              EndTime: end,
            });
            setLoading(false);
            checkCoords(event);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }

    return () => {
      controller.abort();
    };
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
  const [bookmarkBtnColor, setBookmarkBtnColor] = useState(theme.dark.main);

  const bookmarkEvent = () => {
    const find = items.find((event) => event.event_id === item.event_id);
    if (find) {
      //setBookmarkBtn(true);
      setBookmarkBtnColor(theme.primary.main);
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

    var uid = await AsyncStorage.getItem("userId");
    var eventid = id ? id : externalLink;
    var ApiUrl = Connection.url + Connection.organizer;
    //organizer id is the only data to be sent to server in order to retrive organizer data

    var Data = {
      eventid: eventid,
      uid: uid,
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
        if (response.success) {
          let profile = response.profile;
          setEventOrg({
            ...eventOrg,
            featuredImage: profile.profile,
            organizerName: profile.username,
            category: profile.category,
          });
          setOrganizerInfo(profile);
          setFetching(true);

          //check user follow state
          let follow = response.follow;
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
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      // cancel the subscription
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
    var organizerId = item.userId;
    var followerId = await AsyncStorage.getItem("userId");
    var APIUrl = Connection.url + Connection.follow;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var Data = {
      oid: organizerId,
      fid: followerId,
    };
    fetch(APIUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        // effect subscription indicator

        if (response.success) {
          setFollow({
            ...follow,
            subscription: response.message,
            btnDisabled: true,
            ButtonColor:
              response.message === "Following"
                ? Constants.transparentPrimary
                : Constants.primary,
          });
          setFollowProgress(false);
          setFollowStatus(response.message);
        } else {
          setFollow({
            ...follow,
            subscription: response.message,
            btnDisabled: false,
            ButtonColor: Constants.primary,
          });
          setFollowStatus(response.message);
          setFollowProgress(false);
        }
      })
      .catch((error) => {
        //  do something here
      });

    return () => {
      // cancel the subscription

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

      var ApiUrl = Connection.url + Connection.detailTicket + externalLink;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };

      fetch(ApiUrl, {
        method: "GET",
        headers: headers,
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            var eventTickets = response.data;
            setTickets(eventTickets);
            setExist(true);
          } else {
            setTickets();
            setExist(false);
          }
        })
        .catch(() => {
          setExist(false);
        });

      return () => {
        controller.abort();
      };
    } else {
      const controller = new AbortController();
      const signal = controller.signal;
      var ApiUrl = Connection.url + Connection.detailTicket + id;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };

      fetch(ApiUrl, {
        method: "GET",
        headers: headers,
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            var eventTickets = response.data;
            setTickets(eventTickets);
            setExist(true);
          } else {
            setTickets();
            setExist(false);
          }
        })
        .catch(() => {
          setExist(false);
        });

      return () => {
        controller.abort();
      };
    }
  };

  //we call useeffect hook once the component get mounted
  useEffect(() => {
    var isSubcribed = true;
    if (isSubcribed) {
      FeatchEvent();
      FeatchTickets();
      bookmarked();
      featchOrganizer();
      isSubcribed = false;
    }
    return () => {};
  }, [externalLink]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background.faded,
        paddingBottom: exist ? 60 : 20,
      }}
    >
      {loading ? (
        <View>
          <DetailShimmer />
        </View>
      ) : (
        <ScrollView
          scrollEventThrottle={16}
          style={{ backgroundColor: theme.background.faded }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.containerOne}>
            <View
              style={[
                styles.featuredImageContainer,
                { backgroundColor: theme.background.main },
              ]}
            >
              <Image
                //Featured Image of the event
                source={{ uri: featuredImageUri + item.event_image }} //featured image source
                resizeMode="cover"
                style={styles.image} //featured image styles
              />
            </View>

            <View style={styles.actionbuttons}>
              {logged && bookmarked ? (
                <TouchableOpacity
                  //bookmark button beside event title
                  disabled={bookmarkBtn}
                  activeOpacity={0.7}
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: theme.background.main },
                  ]}
                  onPress={() => bookmarkEvent()}
                >
                  <Feather
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
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: theme.background.main },
                  ]}
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
                activeOpacity={0.7}
                style={[
                  styles.bookmarkButton,
                  { backgroundColor: theme.background.main },
                ]}
                onPress={() => ShareEvent(item.event_id)}
              >
                <AntDesign name="sharealt" size={18} style={styles.shareIcon} />
              </TouchableOpacity>

              {item.contact_phone && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: theme.background.main },
                  ]}
                  onPress={() => MakeCall(item.contact_phone)}
                >
                  <Feather
                    name="phone"
                    size={18}
                    color={bookmarkBtnColor}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              )}

              {item.redirectUrl && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: theme.background.main },
                  ]}
                >
                  <Feather
                    name="link"
                    size={18}
                    color={bookmarkBtnColor}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              )}

              {item.address_latitude && item.address_longitude && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: theme.background.main },
                  ]}
                >
                  <SimpleLineIcons
                    name="direction"
                    size={18}
                    color={bookmarkBtnColor}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {item.cancelled == "1" ? (
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

          <View style={{ marginTop: 6 }}>
            <View style={styles.EventTitle}>
              <Text
                numberOfLines={2}
                style={[styles.eventName]} // event name on event detail section
              >
                {item.event_name}
              </Text>

              <View style={styles.actionButton}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      marginHorizontal: 3,
                    }}
                  >
                    345
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderLeftWidth: 0.4,
                    borderColor: theme.dark[300],
                    paddingLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: Constants.Boldtwo,
                      marginHorizontal: 3,
                      color: theme.dark.main,
                    }}
                  >
                    4.7
                  </Text>
                  <AntDesign name="star" size={14} color={theme.primary.main} />
                </View>
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
              isCancelled={item.cancelled}
            />
          </View>

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

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}> Rate this event</Text>
            <Text style={styles.ratingHelper} numberOfLines={1}>
              Tell others what you think
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 9,
                marginLeft: 2,
                width: Dimensions.get("screen").width / 2,
                justifyContent: "space-between",
              }}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => Rated(value)}>
                  <AntDesign
                    name={currentRating >= value ? "star" : "staro"}
                    size={24}
                    color={theme.primary.main}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Rating
              visible={ratingVisible}
              onClose={handleRatingClose}
              currentRating={currentRating}
              onSubmitFeedback={handleSubmitFeedback}
              event={item}
            />
          </View>

          {coords && (
            <View style={[styles.mapContainer]}>
              <View style={styles.mapInfo}>
                <Text style={styles.location}>Location</Text>
                <Text style={styles.venueOnMap} numberOfLines={1}>
                  {item.event_address}
                </Text>
              </View>

              <View style={[styles.mapParent]}>
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
            </View>
          )}

          {featching && (
            <View style={{ backgroundColor: theme.background[100] }}>
              <View style={styles.RelatedEventContainer}>
                <Text style={styles.ratingTitle}> Event Organizer</Text>
              </View>

              <View
                style={[styles.organizersSection]}
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
                    style={[
                      styles.organizerProfile,
                      { borderColor: theme.background.main },
                    ]}
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
                  <Text
                    style={{
                      fontSize: Constants.headingtwo,
                      fontWeight: Typography.weight.semiBold,
                      color: Constants.Inverse,
                    }}
                  >
                    {eventOrg.organizerName}
                  </Text>
                  <Text
                    style={styles.orgCategory} //organizers operation field or category
                  >
                    {eventOrg.category}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Constants.fontFam,
                      fontSize: Constants.thirty,
                      fontWeight: Typography.weight.bold,
                      color: Constants.Inverse,
                    }} //organizers operation field or category
                  >
                    4.9{" "}
                    <AntDesign
                      name="star"
                      size={14}
                      color={theme.primary.main}
                    />
                  </Text>
                </Pressable>
                {/* {logged && (
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
              )} */}
              </View>
            </View>
          )}

          <View style={styles.RelatedEventContainer}>
            <Text style={styles.ratingTitle}> Related events</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme.dark.main,
                  fontFamily: Typography.family,
                  fontSize: Typography.size.headingthree,

                  textTransform: "capitalize",
                  padding: 4,
                }}
                numberOfLines={1}
              >
                {item.category}
              </Text>
            </View>
          </View>

          <ScrollView horizontal>
            <RelatedEvent
              picture={item.event_image}
              name={item.event_name}
              date={item.start_date}
              onPress={() =>
                navigation.navigate("EventDetail", { id: item.id })
              }
            />
          </ScrollView>
        </ScrollView>
      )}
      {exist && item.cancelled == null && (
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
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  containerOne: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height / 2.6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  //featured Image Container Styling
  featuredImageContainer: {
    padding: 10,
    justifyContent: "center",
    width: "80%",
    height: "100%",
    borderTopEndRadius: 6,
    borderBottomEndRadius: 6,
  },
  // Featurd Image style
  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 8,
  },
  //the style of buttons beside the event poster at the top the page
  actionbuttons: {
    width: "18%",
    height: "100%",
    marginLeft: 4,
    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    borderTopStartRadius: 6,
    borderBottomStartRadius: 6,
  },
  // organizers section styling
  organizersSection: {
    width: Dimensions.get("screen").width,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  //organizers profile styling
  organizerProfile: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    marginHorizontal: 20,
  },
  //organizer information section style
  orgInfoContainer: {
    alignSelf: "center",
  },
  // organizer na,me style
  orgName: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  // organizer operation category style
  orgCategory: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.thirty,
    color: Constants.Inverse,
    textTransform: "capitalize",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    paddingLeft: 5,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 1,
  },
  eventName: {
    width: "70%",
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    paddingRight: 8,
    color: Constants.Inverse,
  },
  bookmarkButton: {
    borderRadius: 50,
    padding: 14,
    margin: 5,
    marginVertical: 8,
  },
  bookmarkIcon: {},
  sharekButton: {
    borderRadius: 50,
    padding: 8,
    margin: 5,
    backgroundColor: Constants.Faded,
  },
  descDescription: {
    margin: 10,
    marginTop: 16,
  },
  descTitle: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    marginBottom: 3,
  },
  desctext: {
    margin: 5,
    marginRight: 10,
    fontFamily: Constants.fontFam,
    fontSize: 14,
    lineHeight: 24,
    textAlign: "justify",
    color: Constants.mainText,
  },
  ratingContainer: {
    margin: 10,
    marginVertical: 16,
  },
  ratingTitle: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  ratingHelper: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.thirty,
    color: Constants.Inverse,
    marginLeft: 5,
  },

  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    height: 440,
    borderRadius: 8,
  },
  mapInfo: {
    flexDirection: "column",
    alignSelf: "flex-start",
    paddingLeft: 16,
    marginBottom: 10,
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
  mapParent: {
    width: "94%",
    height: "78%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },

  ticketBtnContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: Constants.Faded,
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
  ReadMore: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    fontStyle: "italic",
    color: Constants.Inverse,
    padding: 6,
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
  RelatedEventContainer: {
    margin: 10,
    marginTop: 16,
    marginBottom: 5,
  },
});
export default EventDetails;
