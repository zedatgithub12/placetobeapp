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
import { Caption, Divider, IconButton, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import call from "react-native-phone-call";
import { AuthContext } from "../../Components/context";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../themes/typography";
import { formatNumber, renderStatus } from "../../Utils/functions";
import Connection from "../../api";
import Loader from "../../ui-components/ActivityIndicator";
import NetInfo from "@react-native-community/netinfo";
import NoConnection from "../../handlers/connection";
import OrganizerSkeleton from "./components/skeleton";

// Organizer detail page
const OrganizersDetail = ({ route, navigation }) => {
  var { eventOrg } = route.params;
  var organizerInfo = eventOrg;
  const { theme } = useTheme();

  const { userStatus } = React.useContext(AuthContext);
  const logged = userStatus.logged;

  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [subscription, setSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [provided, setProvided] = useState(false);
  const [website, setWebsite] = useState(false);
  const [follow, setFollow] = useState({
    subscription: "Follow",
    btnDisabled: false,
    ButtonColor: Constants.primary,
  });

  var featuredImageUri = Connection.url + Connection.assets;
  const logo = organizerInfo.business_logo
    ? organizerInfo.business_logo
    : "businesslogo.png";

  //fetch events organized by event organizer
  const handleFetchingEvents = async () => {
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
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  };

  // state of organizer followers
  const followCounter = async () => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    var userid = await AsyncStorage.getItem("userId");
    var APIUrl =
      Connection.url +
      Connection.OrganizerFollowCounter +
      organizerInfo.id +
      `?userid=${userid}`;

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    fetch(APIUrl, {
      method: "GET",
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          var followers = response.data;

          setCount(followers);
          setFollow({
            ...follow,
            subscription: response.subscription,
            btnDisabled: true,
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        // showToast("Unable to fetch followers");
        setLoading(false);
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
        if (response.success) {
          var followers = response.data;
          setCount(followers);
          setFollow({
            ...follow,
            subscription: response.message,
            btnDisabled: true,
          });

          setFollowStatus(response.message);
          setSubscription(false);
        } else {
          var followers = response.data;
          setCount(followers);
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

  //make call to organizer
  const MakeCall = () => {
    const args = {
      number: organizerInfo.business_phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args);
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
    if (organizerInfo.business_phone !== null) {
      setProvided(true);
    } else {
      setProvided(false);
    }

    if (connection) {
      followCounter();
      handleFetchingEvents();
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
              source={{ uri: featuredImageUri + logo }} //featured image source
              resizeMode="contain"
              style={styles.modalImage} //featured image styles
            />
          </View>
        </View>
      </Modal>
      {Connection ? (
        loading ? (
          <OrganizerSkeleton />
        ) : (
          // <View
          //   style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          // >
          //   <Loader size="large" />
          // </View>
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
                  source={{
                    uri: featuredImageUri + logo,
                  }} //featured image source
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
                    source={{
                      uri: featuredImageUri + logo,
                    }} //featured image source
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
                  {organizerInfo.business_name}
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
                  {organizerInfo.business_category}
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
                      {organizerInfo.rating}
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
                      <Paragraph numberOfLines={1} style={[styles.btnText]}>
                        {follow.subscription}
                      </Paragraph>
                    )}
                  </TouchableOpacity>
                )}

                {provided && (
                  <IconButton
                    style={{
                      backgroundColor: theme.dark[100],
                    }}
                    icon="phone"
                    color={theme.dark[800]}
                    size={24}
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
    width: Dimensions.get("screen").width / 3.6,
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
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
    color: Constants.Inverse,
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
