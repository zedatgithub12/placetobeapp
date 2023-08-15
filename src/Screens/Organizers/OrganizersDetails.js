//import liraries
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../../constants/Constants";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import OrganizerEvents from "./components/events";
import { Caption, Divider, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import call from "react-native-phone-call";
import { AuthContext } from "../../Components/context";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../themes/typography";
import { formatNumber } from "../../Utils/functions";
import Connection from "../../api";
import Loader from "../../ui-components/ActivityIndicator";
import NetInfo from "@react-native-community/netinfo";
import NoConnection from "../../handlers/connection";

// Organizer detail page
const OrganizersDetail = ({ route, navigation }) => {
  var { eventOrg } = route.params;
  var organizerInfo = eventOrg;
  const { theme } = useTheme();
  const numColumns = 3;

  const { userStatus } = React.useContext(AuthContext);
  const logged = userStatus.logged;
  var featuredImageUri = Connection.url + Connection.assets;

  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [subscription, setSubscription] = useState(false);
  const [follow, setFollow] = useState({
    subscription: "",
    btnDisabled: false,
    ButtonColor: Constants.primary,
  });

  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);

  // state of organizer followers
  const followCounter = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    var APIUrl =
      Connection.url + Connection.OrganizerFollowCounter + organizerInfo.id;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var followerId = await AsyncStorage.getItem("userId");
    var Data = {
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
        if (response.success) {
          var followers = response.data;
          setFollow({ ...follow, subscription: response.status });
          setCount(followers);
        } else {
          setCount(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      controller.abort();
    };
  };

  const followOrganizer = async () => {
    setSubscription(true);

    const controller = new AbortController();
    const signal = controller.signal;
    var organizerId = organizerInfo.id;
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
          });
          setSubscription(false);
          setFollowStatus(response.message);
        } else {
          setFollow({
            ...follow,
            subscription: response.message,
            btnDisabled: false,
            ButtonColor: Constants.primary,
          });
          setFollowStatus(response.message);
          setSubscription(false);
        }
      })
      .catch((error) => {
        //  do something here
        setSubscription(false);
      });

    return () => {
      // cancel the subscription
      controller.abort();
    };
  };

  // does organizer have provided phone
  const [provided, setProvided] = useState(false);
  const [website, setWebsite] = useState(false);
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
  const [loading, setLoading] = useState(true);
  //event flatlist related code
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

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

  const RefreshList = async () => {
    setLoading(true);
    // set refreshing state to true
    // featching abort controller
    // after featching events the fetching function will be aborted

    const controller = new AbortController();
    const signal = controller.signal;

    var organizerId = organizerInfo.id;
    var ApiUrl = Connection.url + Connection.organizerEvents + organizerId;

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
          var orgEvents = response.data;
          setEvents(orgEvents);
          setNotFound(false);
          setLoading(false);
        } else {
          setMessage("Event will be listed here.");
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  };

  const retryConnection = () => {
    const InternetConnection = async () => {
      const networkState = await NetInfo.fetch();
      setConnection(networkState.isConnected);
    };

    const handleNetworkChange = (state) => {
      setConnection(state.isConnected);
    };

    setRetry(true); // Set retry to true initially

    setTimeout(async () => {
      await InternetConnection();
      setRetry(false); // Set retry to false after the operation is done
    }, 3000); // 3000 milliseconds = 3 seconds

    const subscription = NetInfo.addEventListener(handleNetworkChange);
  };

  useEffect(() => {
    //check wether event organizer have phone number added to his account
    if (organizerInfo.phone !== null) {
      setProvided(true);
    } else {
      setProvided(false);
    }

    if (connection) {
      followCounter();
      RefreshList();
    }
    return () => {};
  }, [connection]);

  //render item to be displayed in the flatlist
  const renderItem = ({ item }) => (
    <OrganizerEvents
      key={item.id}
      FeaturedImage={item.event_image}
      status={renderStatus(item.start_date, item.end_date)}
      onPress={() => navigation.push("EventDetail", { id: item.id })}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.darker }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={Constants.Inverse}
              />
            </TouchableOpacity>
            <Image
              source={{ uri: featuredImageUri + organizerInfo.profile }} //featured image source
              resizeMode="contain"
              style={styles.modalImage} //featured image styles
            />
          </View>
        </View>
      </Modal>
      {Connection ? (
        loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Loader size="large" />
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: theme.background.main,
                paddingBottom: 8,
              }}
            >
              <View style={styles.featuredImageContainer}>
                <TouchableOpacity
                  style={styles.backArrow} // back arrow button style
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back-sharp" size={25} />
                </TouchableOpacity>
                <Image
                  //Featured Image of the event
                  source={{ uri: featuredImageUri + organizerInfo.profile }} //featured image source
                  resizeMode="cover"
                  style={styles.image} //featured image styles
                  blurRadius={4}
                />
              </View>
              <View
                style={{
                  alignSelf: "center",
                  marginTop: 30,
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.profileImageContainer}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: featuredImageUri + organizerInfo.profile }} //featured image source
                    resizeMode="cover"
                    style={styles.profileImage} //featured image styles
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.contentContainer}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Typography.family,
                    fontSize: Typography.size.primaryHeading,
                    fontWeight: Typography.weight.bold,
                    color: theme.dark.main,
                  }}
                >
                  {organizerInfo.username}
                </Text>
                <Text
                  style={{
                    fontSize: Typography.size.headingthree,
                    fontWeight: Typography.weight.bold,
                    color: theme.dark.main,
                    paddingHorizontal: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {organizerInfo.category}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    padding: 14,
                  }}
                >
                  <Text
                    style={{
                      color: theme.dark.main,
                      fontSize: Typography.size.headingone,
                      fontWeight: Typography.weight.semiBold,
                      fontFamily: Typography.family,
                    }}
                  >
                    {formatNumber(events.length)}
                  </Text>
                  <Caption
                    style={{
                      fontFamily: Typography.family,
                      fontSize: Typography.size.thirty,
                      color: theme.dark.main,
                    }}
                  >
                    Events
                  </Caption>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    padding: 14,
                  }}
                >
                  <Text
                    style={{
                      color: theme.dark.main,
                      fontSize: Typography.size.headingone,
                      fontWeight: Typography.weight.semiBold,
                      fontFamily: Typography.family,
                      marginHorizontal: 40,
                    }}
                  >
                    {formatNumber(count)}
                  </Text>
                  <Caption
                    style={{
                      fontFamily: Typography.family,
                      fontSize: Typography.size.thirty,
                      color: theme.dark.main,
                    }}
                  >
                    Followers
                  </Caption>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.dark.main,
                        alignItems: "center",
                        fontSize: Typography.size.headingone,
                        fontWeight: Typography.weight.semiBold,
                        fontFamily: Typography.family,
                      }}
                    >
                      4.9
                    </Text>
                    <AntDesign
                      name="star"
                      size={14}
                      color={theme.primary.main}
                      style={{ paddingLeft: 3 }}
                    />
                  </View>
                  <Caption
                    style={{
                      fontFamily: Typography.family,
                      fontSize: Typography.size.thirty,
                      color: theme.dark.main,
                    }}
                  >
                    Rating
                  </Caption>
                </View>
              </View>
              <Divider />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 8,
                }}
              >
                {website && (
                  <IconButton
                    style={{
                      backgroundColor: theme.background.faded,

                      marginHorizontal: 16,
                    }}
                    icon="web"
                    color={theme.dark[400]}
                    size={26}
                    onPress={() => console.log("Pressed")}
                  />
                )}

                {logged && (
                  <TouchableOpacity
                    onPress={() => followOrganizer()}
                    activeOpacity={0.7}
                    style={[
                      styles.followBtn,
                      {
                        backgroundColor:
                          follow.subscription === "Following"
                            ? theme.background.faded
                            : theme.primary.main,
                        color:
                          follow.subscription === "Following"
                            ? theme.primary.main
                            : theme.dark.main,
                      },
                    ]}
                  >
                    {subscription ? (
                      <ActivityIndicator size="small" color={theme.dark.main} />
                    ) : (
                      <Text numberOfLines={1} style={[styles.btnText]}>
                        {follow.subscription}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {provided && (
                  <IconButton
                    style={{
                      backgroundColor: theme.success[100],
                    }}
                    icon="phone"
                    color={theme.success[500]}
                    size={26}
                    onPress={() => MakeCall()}
                  />
                )}
              </View>
            </View>

            <View
              style={{
                marginTop: 10,
              }}
            >
              <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
              />
            </View>
          </>
        )
      ) : (
        <NoConnection onPress={() => retryConnection()} isLoading={retry} />
      )}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("screen").height,
    backgroundColor: Constants.Faded,
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
    height: 224,
    borderWidth: 2,
  },
  //featured Image Container Styling
  featuredImageContainer: {
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    height: 60,
    maxHeight: 100,
    marginTop: -30,
  },
  //View container of profile Image and organizer name and category

  profileImageContainer: {
    width: "25%",
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.Faded,
    elevation: 4,
    shadowColor: Constants.Secondary,
  },
  profileImage: {
    height: 94,
    width: 94,
    borderRadius: 47,
  },
  contentContainer: {
    alignSelf: "center",
    alignItems: "center",
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
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 50,
    margin: 10,
  },
  callBtn: {
    alignItems: "center",
    backgroundColor: Constants.background,
    padding: 3,
    paddingHorizontal: 30,
    borderRadius: Constants.tinybox,
    borderWidth: 0.5,
    borderColor: Constants.primary,
  },
  btnText: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
  },
  callText: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    color: Constants.primary,
  },
  notFound: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },

  imageContainer: {
    flex: 1,
    marginLeft: 1.5,
    aspectRatio: 1, // To maintain the square shape of the images
  },
  posters: {
    width: Dimensions.get("screen").width / 3 - 4, // Subtracting margin from width
    height: Dimensions.get("screen").width / 3 - 4,
    resizeMode: "cover",
    borderRadius: 2,
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
    backgroundColor: "#0009",
  },
  modalView: {
    alignItems: "center",
    aspectRatio: 1,
  },
  modalImage: {
    width: Dimensions.get("screen").width,
    height: 400,
    resizeMode: "contain",
  },
  button: {
    alignSelf: "flex-end",
    borderRadius: 50,
    padding: 7,
    margin: 10,

    elevation: 2,
  },

  buttonClose: {
    backgroundColor: Constants.Faded,
    position: "absolute",
    top: 6,
    right: 2,
    zIndex: 10,
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
  eventList: {},
});

//make this component available to the app
export default OrganizersDetail;
