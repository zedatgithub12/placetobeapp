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
  TouchableNativeFeedback,
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
  getCurrentDate,
  formattedDate,
} from "../../Utils/functions";
import EventCounter from "./components/counter";
import Preferences from "../../preferences";

function Home({ navigation, ...props }) {
  const { theme } = useTheme();
  const { userStatus, userInfoFunction } = React.useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [active, setActive] = useState("All");
  const [events, setEvents] = useState([]);
  const [eventShimmer, setEventShimmer] = useState(true);
  const [filteredEvent, setFilteredEvent] = useState([]);
  // state of event in the homepage
  const [featured, setFeatured] = useState([]);
  const [happening, setHappening] = useState([]);
  const [thisWeek, setThisWeek] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const today = getCurrentDate();
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

  // featch Featured events
  //featured events are the event which have high priority or value of number 1 in databse table
  const FeatchEvents = () => {
    setLoading(true);

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
          setLoading(false);
        } else {
          setEventShimmer(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        setEventShimmer(false);
        setLoading(false);
      });
  };

  const handleCategoryClick = (categoryname, type) => {
    setActive(categoryname);
    if (active === "All") {
      renderAll();
    } else {
      renderFilter(categoryname, type);
    }
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
      var Api = Connection.url + Connection.WeekEvents;
      fetchEvent(Api);
    } else if (category === "Upcoming") {
      //filter upcoming events
      var Api = Connection.url + Connection.UpcomingEvents;
      fetchEvent(Api);
    } else if (category === "Happening") {
      //filter events happening today
      var Api = Connection.url + Connection.TodayEvents;
      fetchEvent(Api);
    }
  };

  const fetchEvent = (Api) => {
    setLoading(true);

    fetch(Api, {
      method: "GET",
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        if (response.success) {
          setFilteredEvent(response.data);
          setLoading(false);
          renderAll();
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  /****************************************
   * Render events those the category is "All"
   */
  const renderAll = () => {
    const featured_event = events.filter((event) => event.priority === 1);
    setFeatured(featured_event);

    const happening_event = events.filter(
      (event) => event.start_date <= today && event.end_date >= today
    );
    setHappening(happening_event);

    const upcoming_event = events.filter(
      (event) => event.start_date <= today && event.end_date >= today
    );
    setUpcoming(upcoming_event);
  };

  const weekEvents = () => {
    const this_weekevents = events.filter((event) => {
      const currentDate = new Date();
      // Get the start and end dates of the week
      const startOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
      );
      const endOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + (6 - currentDate.getDay())
      );
      // Convert the event's start and end dates to Date objects
      const eventStartDate = new Date(formattedDate(event.start_date));
      const eventEndDate = new Date(formattedDate(event.end_date));

      // Check if the event's start date is within the current week
      const isStartDateValid =
        eventStartDate >= startOfWeek && eventStartDate <= endOfWeek;

      // Check if the event's end date is within the current week
      const isEndDateValid =
        eventEndDate >= startOfWeek && eventEndDate <= endOfWeek;

      // Return true only if all conditions are met
      return isStartDateValid && isEndDateValid;
    });

    setThisWeek(this_weekevents);
  };

  const upcomingEvents = () => {
    const upcomings = events.filter((event) => {
      const currentDate = new Date();

      const endOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + (6 - currentDate.getDay())
      );
      // Convert the event's start and end dates to Date objects
      const eventStartDate = new Date(formattedDate(event.start_date));

      // Check if the event's start date is after the end of the current week
      const isStartDateValid = eventStartDate > endOfWeek;

      // Return true only if all conditions are met
      return isStartDateValid;
    });

    setUpcoming(upcomings);
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
    FeatchEvents();
    weekEvents();
    upcomingEvents();
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
            <View style={styles.homescrollview}>
              {active === "All" ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {featured.length > 0 && loading ? (
                    <Loader size="small" />
                  ) : (
                    <View style={{ marginVertical: 5 }}>
                      {featured.map((item, index) => (
                        <Events
                          key={index}
                          Event_Id={item.id}
                          org_id={item.userId}
                          FeaturedImage={item.event_image}
                          title={item.event_name}
                          date={DateFormater(item.start_date)}
                          time={TimeFormater(item.start_time)}
                          venue={item.event_address}
                          category={CategoryColor(item.category)}
                          Price={EntranceFee(item.event_entrance_fee)}
                          onPress={() =>
                            navigation.navigate("EventDetail", { id: item.id })
                          }
                        />
                      ))}

                      {featured.length > Preferences.listedEvent && (
                        <EventCounter
                          events={featured}
                          onPress={() =>
                            handleCategoryClick("Featured", "filter")
                          }
                        />
                      )}
                    </View>
                  )}
                  <Slider />

                  {/* Happening event listing */}
                  {happening.length > 0 && loading ? (
                    <Loader size="small" />
                  ) : (
                    <View>
                      <View style={{ paddingVertical: 2 }}>
                        <Text style={styles.title}>Happening</Text>
                      </View>
                      {happening.map((item, index) => (
                        <Events
                          key={index}
                          Event_Id={item.id}
                          org_id={item.userId}
                          FeaturedImage={item.event_image}
                          title={item.event_name}
                          date={DateFormater(item.start_date)}
                          time={TimeFormater(item.start_time)}
                          venue={item.event_address}
                          category={CategoryColor(item.category)}
                          Price={EntranceFee(item.event_entrance_fee)}
                          onPress={() =>
                            navigation.navigate("EventDetail", { id: item.id })
                          }
                        />
                      ))}

                      {happening.length > Preferences.listedEvent && (
                        <EventCounter
                          events={happening}
                          onPress={() =>
                            handleCategoryClick("Happening", "status")
                          }
                        />
                      )}
                    </View>
                  )}

                  {/* This week event listing */}
                  {thisWeek.length > 0 && loading ? (
                    <Loader size="small" />
                  ) : (
                    <View>
                      <View style={{ paddingVertical: 2 }}>
                        <Text style={styles.title}>This Week</Text>
                      </View>
                      {thisWeek.map((item, index) => (
                        <Events
                          key={index}
                          Event_Id={item.id}
                          org_id={item.userId}
                          FeaturedImage={item.event_image}
                          title={item.event_name}
                          date={DateFormater(item.start_date)}
                          time={TimeFormater(item.start_time)}
                          venue={item.event_address}
                          category={CategoryColor(item.category)}
                          Price={EntranceFee(item.event_entrance_fee)}
                          onPress={() =>
                            navigation.navigate("EventDetail", { id: item.id })
                          }
                        />
                      ))}

                      {thisWeek.length > Preferences.listedEvent && (
                        <EventCounter
                          events={thisWeek}
                          onPress={() =>
                            handleCategoryClick("This Week", "status")
                          }
                        />
                      )}
                    </View>
                  )}

                  {/* upcoming event listing */}
                  {upcoming.length > 0 && loading ? (
                    <Loader size="small" />
                  ) : (
                    <View>
                      <View style={{ paddingVertical: 2 }}>
                        <Text style={styles.title}>Upcomings</Text>
                      </View>
                      {upcoming.map((item, index) => (
                        <Events
                          key={index}
                          Event_Id={item.id}
                          org_id={item.userId}
                          FeaturedImage={item.event_image}
                          title={item.event_name}
                          date={DateFormater(item.start_date)}
                          time={TimeFormater(item.start_time)}
                          venue={item.event_address}
                          category={CategoryColor(item.category)}
                          Price={EntranceFee(item.event_entrance_fee)}
                          onPress={() =>
                            navigation.navigate("EventDetail", { id: item.id })
                          }
                        />
                      ))}

                      {upcoming.length > Preferences.listedEvent && (
                        <EventCounter
                          events={upcoming}
                          onPress={() =>
                            handleCategoryClick("Upcoming", "status")
                          }
                        />
                      )}
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
  homescrollview: {
    marginBottom: 55,
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
  title: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Boldtwo,
    marginLeft: 10,
    marginTop: 6,
    marginBottom: 2,
  },
});

export default Home;
