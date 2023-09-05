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
  Linking,
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
import { AuthContext } from "../../Components/context";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
import { bookmarkItem, remove } from "../../Reducer/saveSlice";
import Share from "react-native-share";
import call from "react-native-phone-call";
import * as Animatable from "react-native-animatable";
import DetailShimmer from "../../Components/Events/Skeleton/DetailShimmer";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { useTheme } from "@react-navigation/native";
import Rating from "../../Components/Events/Rating";
import RelatedEvent from "../../Components/Events/related";
import { Typography } from "../../themes/typography";
import { DateFormater, TimeFormater } from "../../Utils/functions";
import Connection from "../../api";
import galleryImage from "../../assets/images/galleryImage.png";
import { showToast } from "../../Utils/Toast";
import NotFound from "../../handlers/NotFound";
import FailedToFetch from "../../handlers/unresolved/fetching";

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
  const [item, setItem] = useState([]);
  const [eventOrg, setEventOrg] = useState([]);
  const [rating, setRating] = useState();
  const [numberOfRatings, setNumberOfRatings] = useState();
  const [loading, setLoading] = useState(true);
  const [fetchingFailed, setFetchingFailed] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingDetails, setRatingDetails] = useState([]);
  const [userRated, setUserRated] = useState(false);
  const [relatedEvents, setRelatedEvent] = useState([]);
  const [exist, setExist] = useState(false); // the state of ticket existance
  const [mapOpen, setMapOpen] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [read, setRead] = useState(5);
  const [readMorebtn, setReadMorebtn] = useState(false);
  const [textLength, setTextLength] = useState(read);
  const [descLength, setDescLength] = useState("Read More");
  const [timing, setTime] = useState({
    StartTime: "",
    EndTime: "",
  });

  const [coords, setCoords] = useState(true);
  const [bookmarkBtn, setBookmarkBtn] = useState(false);
  const [bookmarkBtnColor, setBookmarkBtnColor] = useState(theme.dark.main);
  const [bookmarkBtnBackground, setBookmarkBtnBackground] = useState(
    theme.background.main
  );
  var featuredImageUri = Connection.url + Connection.assets;

  const MakeCall = (phone) => {
    const args = {
      number: phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args);
  };

  const Rated = async (value) => {
    if (logged) {
      setCurrentRating(value);
      await getUserInfo();
      setRatingVisible(true);
    } else {
      SignInAlert("Rating", "Please sign in first to rate this event");
    }
  };

  const handleRatingClose = () => {
    setRatingVisible(false);
  };

  const getUserInfo = async () => {
    var userId = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.MetaData + userId;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    //save user info into database
    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          let userInfo = response.data;
          setUserInfo(userInfo);
        } else {
          showToast(response.message);
        }
      })
      .catch(() => {
        showToast("Unable to fetch user informations");
      });
  };

  const handleSubmitRating = async (rating, review) => {
    const userid = await AsyncStorage.getItem("userId");
    if (userid) {
      var updateApi =
        Connection.url +
        Connection.updateRating +
        ratingDetails.id +
        `?userid=${userid}`;
      var submitRating = Connection.url + Connection.addRating;
      var ApiUrl = userRated ? updateApi : submitRating;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const data = {
        user_id: userid,
        event_id: item.id,
        rating: rating,
        review: review,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          showToast(response.message);
        })
        .catch((error) => {
          showToast("Unable to rate");
        });
    } else {
      showToast("Error submitting reviews");
    }
  };

  const checkCoords = (latlng) => {
    var latitude = latlng.address_latitude;
    var longitude = latlng.address_latitude;

    if (latitude == null && longitude == null) {
      setCoords(false);
    }
  };

  const createMapLink = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    return mapUrl;
  };

  const getDirection = async (latitude, longitude) => {
    if (latitude && longitude !== null) {
      const mapLink = createMapLink(latitude, longitude);

      try {
        const supported = await Linking.canOpenURL(mapLink);

        if (supported) {
          await Linking.openURL(mapLink);
        } else {
          showToast("No application found to handle the URL.");
        }
      } catch (error) {
        showToast("An error occurred while opening the link:");
      }
    }
  };

  const openLink = async (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      showToast("Error opening URL");
    }
  };

  const FeatchEvent = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    var Externally = Connection.url + Connection.eventDetails + externalLink;
    var InApp = Connection.url + Connection.eventDetails + id;
    var ApiUrl = externalLink ? Externally : InApp;

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
          let ticket = response.tickets;
          let organizer = response.organizer;
          let rating = response.rating;
          let numberOfRatings = response.numberOfRatings;

          let startTime = response.StartTime;
          let EndTime = response.EndTime;
          var start = TimeFormater(startTime);
          var end = TimeFormater(EndTime);
          setItem(event);
          setExist(ticket);
          setEventOrg(organizer);
          setRating(rating);
          setNumberOfRatings(numberOfRatings);
          setTime({
            ...timing,
            StartTime: start,
            EndTime: end,
          });
          setLoading(false);
          checkCoords(event);
        } else {
          setLoading(false);
          setFetchingFailed(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setFetchingFailed(true);
      });

    return () => {
      controller.abort();
    };
  };

  const FetchUserRating = async () => {
    const userid = await AsyncStorage.getItem("userId");

    if (userid) {
      const controller = new AbortController();
      const signal = controller.signal;

      var Externally =
        Connection.url +
        Connection.moreEventDetails +
        `?eventid=${externalLink}&userid=${userid}`;
      var InApp =
        Connection.url +
        Connection.moreEventDetails +
        `?eventid=${id}&userid=${userid}`;
      var ApiUrl = externalLink ? Externally : InApp;

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
            setRatingDetails(response.userrating);
            setCurrentRating(response.userrating.rating);
            setRelatedEvent(response.related);
            setUserRated(response.userrating.rating ? true : false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });

      return () => {
        controller.abort();
      };
    }
  };

  const bookmarkEvent = () => {
    const find = items.find((event) => event.id === item.id);
    if (find) {
      //setBookmarkBtn(true);
      setBookmarkBtnColor(theme.dark.main);
      setBookmarkBtnBackground(theme.background.main);
      dispatch(remove(item.id));
      showToast("Unsaved!");
    } else {
      dispatch(bookmarkItem(item));
      // setBookmarkBtn(true);
      setBookmarkBtnBackground(theme.primary.light);
      setBookmarkBtnColor(theme.primary.main);
      showToast("Saved!");
    }
  };

  const bookmarked = () => {
    var yesItis = false;
    const find = items.find((event) => event.id === id);
    if (find) {
      setBookmarkBtnColor(theme.primary.main);
      yesItis = true;
      return yesItis;
    }
    return yesItis;
  };

  const SignInAlert = (title, description) =>
    Alert.alert(title, description, [
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

  const ShareEvent = async (eventId) => {
    let remoteUrl = featuredImageUri + item.event_image;
    let event_image = item.event_image;

    let localPath = `${FileSystem.cacheDirectory}${event_image}`;
    FileSystem.downloadAsync(remoteUrl, localPath);

    var sharedEvent = "event/" + eventId;
    var sharedLink = Constants.domain + sharedEvent;

    const shareOptions = {
      url: localPath,
      title: item.event_name,
      message: "Check out this event on Place to be Ethiopia " + sharedLink,
    };

    await Share.open(shareOptions).catch((err) => {});
  };

  const onTextLayout = React.useCallback((e) => {
    const lineLength = e.nativeEvent.lines.length; // get text line count

    if (lineLength > read) {
      setTextLength(lineLength);
      setReadMorebtn(true);
    }
  }, []);

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

  const openRelatedEvent = (eventid) => {
    navigation.push("EventDetail", { id: eventid });
  };

  useEffect(() => {
    FeatchEvent();
    FetchUserRating();
    bookmarked();

    return () => {};
  }, [id]);

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
      ) : fetchingFailed ? (
        <FailedToFetch
          image={require("../../assets/images/loading.png")}
          title=""
          helperText="Failed to load event details"
          onPress={() => FeatchEvent()}
        />
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

            <View style={[styles.actionbuttons]}>
              {logged && bookmarked ? (
                <TouchableOpacity
                  disabled={bookmarkBtn}
                  activeOpacity={0.7}
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: bookmarkBtnBackground },
                  ]}
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
                  activeOpacity={0.7}
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: theme.background.main },
                  ]}
                  onPress={() =>
                    SignInAlert(
                      "Bookmark",
                      "SignIn first to bookmark this event!"
                    )
                  }
                >
                  <Feather
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
                onPress={() => ShareEvent(item.id)}
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
                    color={theme.dark.main}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              )}

              {item.redirectUrl && (
                <TouchableOpacity
                  onPress={() => openLink(item.redirectUrl)}
                  activeOpacity={0.7}
                  style={[
                    styles.bookmarkButton,
                    { backgroundColor: theme.background.main },
                  ]}
                >
                  <Feather
                    name="link"
                    size={18}
                    color={theme.dark.main}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {item.cancelled === "1" && (
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
          )}

          <View style={{ marginTop: 6 }}>
            <View style={styles.EventTitle}>
              <Text
                numberOfLines={2}
                style={[styles.eventName]} // event name on event detail section
              >
                {item.event_name}
              </Text>

              {numberOfRatings > 0 && (
                <View style={styles.actionButton}>
                  <TouchableOpacity
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
                      {numberOfRatings}
                    </Text>
                  </TouchableOpacity>
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
                      {rating}
                    </Text>
                    <AntDesign
                      name="star"
                      size={14}
                      color={theme.primary.main}
                    />
                  </View>
                </View>
              )}
            </View>

            <DetailContent
              StartDate={DateFormater(item.start_date)}
              StartTime={timing.StartTime}
              EndDate={DateFormater(item.end_date)}
              EndTime={timing.EndTime}
              Price={item.event_entrance_fee}
              Venues={item.event_address}
              direction={() =>
                getDirection(item.address_latitude, item.address_longitude)
              }
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
            {readMorebtn && (
              <TouchableOpacity activeOpacity={0.7} onPress={() => showmore()}>
                <Text style={styles.ReadMore}>{descLength}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.ratingContainer}>
            {userRated ? (
              <>
                <Text style={styles.ratingTitle}>
                  Your rating {ratingDetails.review && "& reviews"}
                </Text>

                {ratingDetails.review && (
                  <Text
                    style={[styles.ratingHelper, { lineHeight: 18 }]}
                    numberOfLines={2}
                  >
                    {ratingDetails.review}
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.ratingTitle}> Rate this event</Text>
                <Text style={styles.ratingHelper} numberOfLines={1}>
                  Tell others what you think
                </Text>
              </>
            )}

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
              onSubmitFeedback={handleSubmitRating}
              event={item}
              previousReview={
                ratingDetails.review ? ratingDetails.review : null
              }
              user={userInfo}
            />
          </View>

          {coords && (
            <View
              style={[
                styles.mapContainer,
                { width: "100%", height: mapOpen ? 440 : 80 },
              ]}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.mapInfo}>
                  <Text style={styles.location}>Map</Text>
                  <Text style={styles.venueOnMap} numberOfLines={1}>
                    {item.event_address}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    marginRight: 14,
                    padding: 4,
                    backgroundColor: theme.dark[100],
                  }}
                  onPress={() => setMapOpen(!mapOpen)}
                >
                  <AntDesign
                    name={mapOpen ? "down" : "right"}
                    size={16}
                    color={theme.dark.main}
                  />
                </TouchableOpacity>
              </View>

              {mapOpen && (
                <View style={[styles.mapParent]}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    mapType="standard"
                    userInterfaceStyle="dark"
                    loadingEnabled={true}
                    loadingBackgroundColor={Constants.Faded}
                    loadingIndicatorColor={Constants.primary}
                    tintColor={Constants.primary}
                    showsUserLocation={true}
                    scrollEnabled={false}
                    style={styles.map}
                    initialRegion={{
                      latitude: parseFloat(
                        item.address_latitude
                          ? item.address_latitude
                          : 8.9633373
                      ),
                      longitude: parseFloat(
                        item.address_longitude
                          ? item.address_longitude
                          : 38.6957437
                      ),
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(
                          item.address_latitude
                            ? item.address_latitude
                            : 8.9633373
                        ),
                        longitude: parseFloat(
                          item.address_longitude
                            ? item.address_longitude
                            : 38.6957437
                        ),
                      }}
                      image={{
                        uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Dmap%2BMarker&psig=AOvVaw1sWuU_lBSs-5sii34I1Nz_&ust=1676116422134000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCLDxkLXyiv0CFQAAAAAdAAAAABAF",
                      }}
                    />
                    <Callout tooltip={true} />
                  </MapView>
                </View>
              )}
            </View>
          )}

          <View style={{ backgroundColor: theme.background.darker }}>
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
                    eventOrg,
                  })
                }
              >
                {eventOrg.business_logo ? (
                  <Image
                    source={{
                      uri: featuredImageUri + eventOrg.business_logo,
                    }}
                    style={[
                      styles.organizerProfile,
                      { borderColor: theme.background.main },
                    ]}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={galleryImage}
                    style={[
                      styles.organizerProfile,
                      { borderColor: theme.background.main },
                    ]}
                    resizeMode="contain"
                  />
                )}
              </Pressable>
              <Pressable
                // organizers name and operation category will be listed inside this component
                style={styles.orgInfoContainer}
                onPress={() =>
                  navigation.navigate("Organizer Detail", {
                    eventOrg,
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
                  {eventOrg.business_name}
                </Text>
                <Text
                  style={styles.orgCategory} //organizers operation field or category
                >
                  {eventOrg.business_category}
                </Text>

                {parseInt(eventOrg.rating) > 0 && (
                  <Text
                    style={{
                      fontFamily: Constants.fontFam,
                      fontSize: Constants.thirty,
                      fontWeight: Typography.weight.bold,
                      color: Constants.Inverse,
                    }} //organizers operation field or category
                  >
                    {parseInt(eventOrg.rating)}
                    <AntDesign
                      name="star"
                      size={14}
                      color={theme.primary.main}
                    />
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          {relatedEvents.length > 1 && (
            <View>
              <View style={styles.RelatedEventContainer}>
                <Text style={styles.RelatedEventTitle}> Related events</Text>
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
                      paddingVertical: 1,
                    }}
                    numberOfLines={1}
                  >
                    {item.category}
                  </Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedEvents
                  .filter((event) => event.id !== item.id)
                  .map((event) => (
                    <View key={event.id}>
                      <RelatedEvent
                        picture={event.event_image}
                        name={event.event_name}
                        date={event.start_date}
                        onPress={() => openRelatedEvent(event.id)}
                      />
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
      {!loading && exist && (
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
    padding: 5,
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
    borderRadius: 6,
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
    marginLeft: 2,
  },

  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    borderRadius: 8,
  },
  mapInfo: {
    flexDirection: "column",
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
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  // map: {

  //   width: "100%",
  //   height: "100%",
  //   borderRadius: 6,
  //   overflow: "hidden",
  // },

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
    marginTop: 30,
    marginBottom: 0,
  },
  RelatedEventTitle: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
});
export default EventDetails;
