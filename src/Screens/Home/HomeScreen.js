import React, { useEffect, useState } from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../../constants/Constants";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import { Divider } from "react-native-paper";
import { AuthContext } from "../../Components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../../api";
import Categories from "../../Components/Categories/CategoryListing";
import Category from "../../data/Category";
import Events from "../../Components/Events/Events";
import Listing from "../../Components/Events/Skeleton/ListShimmer";
import { LocalNotification } from "../../Utils/localPushController";
import Slider from "../../Components/Slider";
import NoConnection from "../../handlers/connection";
import { useTheme } from "@react-navigation/native";
import Loader from "../../ui-components/ActivityIndicator";
import { HelperText } from "react-native-paper";
import {
  DateFormater,
  TimeFormater,
  CategoryColor,
  EntranceFee,
} from "../../Utils/functions";

function Home({ navigation, ...props }) {
  const { theme } = useTheme();
  const { userStatus, userInfoFunction } = React.useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [active, setActive] = useState("All");
  const [events, setEvents] = useState([]);
  const [eventShimmer, setEventShimmer] = useState(true);
  const [filteredEvent, setFilteredEvent] = useState([]);
  // check if the profile got updated and update the top right profile indicator
  const profile = () => {
    navigation.navigate("Profile");
    userProfile();
  };

  // function to set user profile while user is logged in
  const [userPhoto, setUserphoto] = useState("maleProfile.jpg");

  const userProfile = async () => {
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
          var userInfo = response.data;
          setUserphoto(userInfo.profile);
        } else {
          setUserphoto(userPhoto);
        }
      })
      .catch(() => {
        setUserphoto(userPhoto);
      });
  };

  //featch available tickets
  const FeatchTickets = () => {
    var ApiUrl = Connection.url + Connection.AvailableTickets;

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // start Api request
    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setTickets(response.data);
          setTicketShimmer(false);
        } else {
          setTicketShimmer(false);
        }
      })
      .catch((error) => {
        console.log("Error ticket featching" + error);
        setTicketShimmer(false);
      });
  };

  // featch Featured events
  //featured events are the event which have high priority or value of number 1 in databse table
  const FeatchEvents = () => {
    var ApiUrl = Connection.url + Connection.events;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setEvents(response.data);
          setEventShimmer(false);
        } else {
          setEventShimmer(false);
        }
      })
      .catch((error) => {
        setEventShimmer(false);
      });
  };

  // const filteredData = events.filter((event) => {
  //   let isMatch = true;
  //   if (categoryFilter !== "Category") {
  //     isMatch = isMatch && event.category === categoryFilter;
  //   }
  //   return isMatch;
  // });

  const handleCategoryClick = (categoryname, type) => {
    setActive(categoryname);
    if (active === "All") {
      renderAll();
    } else {
      renderFilter(categoryname, type);
    }
  };

  /****************************************
   * Render events those the category is "All"
   */
  const renderAll = () => {
    return;
  };

  /****************************************
   * Render events those the category is other than "All"
   */
  const renderFilter = (category, type) => {
    if (type === "status") {
      statusFilter(category);
    } else if (type === "filter") {
      const filteredData = events.filter((event) => event.priority === 1);
      setFilteredEvent(filteredData);
    } else if (type === "category") {
      const filteredData = events.filter(
        (event) => event.category === category
      );
      setFilteredEvent(filteredData);
    }
  };

  /*******************************************
   * Filter event in status
   * the status are
   * Happening, This week, Upcoming
   */

  const statusFilter = (category) => {
    if (category === "This week") {
      //filter events in this week
    } else if (category === "Upcoming") {
      //filter upcoming events
    } else {
      //filter events happening today
    }
  };
  // render item in flatlist format
  const renderItem = ({ item }) => (
    <Events
      Event_Id={item.id}
      org_id={item.userId}
      FeaturedImage={item.event_image}
      title={item.event_name}
      date={DateFormater(item.start_date)}
      time={TimeFormater(item.start_time)}
      venue={item.event_address}
      category={CategoryColor(item.category)}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("EventDetail", { id: item.id })}
    />
  );

  // //image to be used in notification
  // const featuredImageUri =
  //   Connection.url + Connection.assets + "Placeholder.png";
  // const NotificationIcon = Connection.url + Connection.assets + "favicon.png";

  useEffect(() => {
    const InternetConnection = async () => {
      const networkState = await NetInfo.fetch();
      setConnection(networkState.isConnected);
    };
    InternetConnection();

    const subscription = NetInfo.addEventListener(async (state) => {
      setConnection(state.isConnected);
    });
    return () => {
      subscription();
    };
  }, [retry]);

  useEffect(() => {
    userInfoFunction();
    userProfile();
    FeatchTickets();
    FeatchEvents();
    return () => {};
  }, [logged]);

  const logged = userStatus.logged;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.primary.main} barStyle="dark-content" />
      <View>
        <View
          //to component container
          // profile avatar, App name and serach is included inside the component
          style={[styles.headers, { backgroundColor: theme.background.main }]}
        >
          <View style={styles.brands}>
            <Image
              source={require("../../assets/images/homebranding.png")}
              resizeMode="cover"
              style={{ width: 130, height: 60 }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.searchBtn,
              { backgroundColor: theme.background.faded },
            ]}
            onPress={() => navigation.push("Eventcat")}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={Constants.primary}
              style={styles.submitIcon}
            />
          </TouchableOpacity>

          {logged ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => profile()}
              style={styles.profileContainer}
            >
              <Image
                source={{ uri: Connection.url + Connection.assets + userPhoto }}
                style={styles.profileIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SignIn")}
              style={styles.profileContainer}
            >
              <Ionicons
                name="person"
                size={22}
                //style={styles.profileIcon}
                color={Constants.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.homeSection2}>
          <ScrollView contentContainerStyle={{ minHeight: 40 }}>
            <View>
              <ScrollView
                horizontal
                contentContainerStyle={styles.categories}
                showsHorizontalScrollIndicator={false}
              >
                {Category.map((item, index) => (
                  <Categories
                    key={index}
                    icon={item.icon}
                    category={item.name}
                    border={item.color}
                    background={
                      active === item.name ? item.color : theme.background.main
                    }
                    color={
                      active === item.name
                        ? Constants.background
                        : Constants.Inverse
                    }
                    onPress={() => handleCategoryClick(item.name, item.type)}
                  />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionthree}>
          {connection ? (
            <View>
              {active === "All" ? (
                <ScrollView contentContainerStyle={styles.categories}>
                  {loading ? (
                    <Loader size="small" />
                  ) : (
                    <View>
                      <Text>{active}</Text>
                    </View>
                  )}
                </ScrollView>
              ) : (
                <View>
                  {loading ? (
                    <Loader size="small" />
                  ) : (
                    <FlatList
                      // List of events in extracted from database in the form JSON data
                      data={filteredEvent}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      nestedScrollEnabled
                      initialNumToRender={2} // Reduce initial render amount
                      maxToRenderPerBatch={1} // Reduce number in each render batch
                      updateCellsBatchingPeriod={100} // Increase time between renders
                      windowSize={7} // Reduce the window size
                      ListEmptyComponent={
                        <View style={styles.container}>
                          <Image
                            source={require("../../assets/images/NotFound.png")}
                            resizeMode="contain"
                            style={styles.notFound}
                          />
                          <Text style={styles.emptyMessageStyle}>
                            We don't have event for today!
                          </Text>
                          <HelperText style={{ alignSelf: "center" }}>
                            Check events of the week
                          </HelperText>
                        </View>
                      }
                    />
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={{ height: Dimensions.get("screen").height / 1.2 }}>
              <NoConnection onPress={() => setRetry(!retry)} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  headers: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "center",
    marginBottom: 10,
    position: "absolute",
    zIndex: 1000,
  },
  SearchFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    backgroundColor: Constants.background,
    borderRadius: 50,
    paddingLeft: 10,
  },
  brands: {
    flexDirection: "row",
    alignItems: "center",
    width: "76%",
  },
  SearchField: {
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingone,
    alignSelf: "center",
  },
  profileContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: Constants.transparentPrimary,
    padding: 5,
    elevation: 2,
    shadowColor: Constants.Faded,
    marginRight: 8,
  },
  profileImage: {
    alignSelf: "center",
  },
  profileIcon: {
    width: 31,
    height: 31,
    borderRadius: 18,
  },
  PrimaryTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    padding: 20,
    backgroundColor: Constants.purple,
    width: "90%",
    margin: 10,
    marginTop: 12,
    borderRadius: Constants.tinybox,
    elevation: 12,
    shadowColor: Constants.Secondary,
  },
  PrimaryTitleText: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,

    color: Constants.background,
  },
  searchBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    backgroundColor: Constants.transparentPrimary,
    borderRadius: 16,
    marginRight: 8,
  },
  statusFilter: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: Constants.padd,
  },
  statusFilterBtn: {
    width: "23%",
    backgroundColor: Constants.backgroundtwo,
    borderRadius: Constants.mediumbox,
    justifyContent: "center",
    alignItems: "center",
  },
  statusFilterTxt: {
    fontWeight: Constants.Bold,
  },
  statusFilterCalendar: {
    width: "15%",
    backgroundColor: Constants.background,
    borderRadius: Constants.mediumbox,
    justifyContent: "center",
    alignItems: "center",
  },
  homeSection2: {
    marginTop: 68,
  },
  categories: {
    paddingHorizontal: 6,
  },
  sectionthree: {},
  notFound: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  emptyMessageStyle: {
    fontSize: Constants.headingthree,
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

export default Home;
