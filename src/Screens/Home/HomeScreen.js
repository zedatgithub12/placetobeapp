import React, { useEffect, useState } from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
import { AuthContext } from "../../Components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../../api";
import Categories from "../../Components/Categories/CategoryListing";
import Category from "../../data/Category";
import EventStatus from "../../data/eventStatus";
import Events from "../../Components/Events/Events";
import Slider from "../../Components/Slider";
import NoConnection from "../../handlers/connection";
import { useTheme } from "@react-navigation/native";
import Loader from "../../ui-components/ActivityIndicator";
import { Divider } from "react-native-paper";
import {
  DateFormater,
  TimeFormater,
  CategoryColor,
  EntranceFee,
  getCurrentDate,
} from "../../Utils/functions";
import NativeAdsOne from "../../Components/Ads/nativeAd1";
import HeaderAds from "../../Components/Ads/headerAds";
import { fetchAds, UserInteraction } from "../../Utils/Ads";
import Statuses from "../../Components/Categories/statusFiltering";
import NotFound from "../../handlers/NotFound";

function Home({ navigation, ...props }) {
  const { theme } = useTheme();
  const { userStatus, userInfoFunction } = React.useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState(true);
  const [Api, setApi] = useState(Connection.url + Connection.FeaturedEvent);
  const [retry, setRetry] = useState(false);
  const [active, setActive] = useState("All");
  const [status, setStatus] = useState("Featured");

  const [events, setEvents] = useState([]);
  const [filteredEvent, setFilteredEvent] = useState([]);

  const [showBannerAds, setShowBannerAds] = useState(false);
  const [bannerAds, setBannerAds] = useState([]);
  const [showNativeAd, setShowNativeAd] = useState(false);
  const [nativeAd, setNativeAd] = useState([]);
  const [showCardAd, setShowCardAd] = useState(false);
  const [AdsInfo, setAdsInfo] = useState([]);

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

  const fetchEvent = () => {
    setLoading(true);

    fetch(Api, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setEvents(response.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

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

  const handleBannerAds = async (type) => {
    try {
      const response = await fetchAds(type);
      if (response.success) {
        setBannerAds(response.data);
        setShowBannerAds(true);
      } else {
        setShowBannerAds(false);
      }
    } catch (error) {
      setShowBannerAds(false);
    }
  };

  const handleNativeCardAds = async (type) => {
    try {
      const response = await fetchAds(type);
      if (response.success) {
        setAdsInfo(response.data);
        setShowCardAd(true);
      } else {
        setShowCardAd(false);
      }
    } catch (error) {
      setShowCardAd(false);
    }
  };
  //handle component mounting event
  useEffect(() => {
    fetchEvent();
    return () => {};
  }, [Api]);
  //handle component mounting event
  useEffect(() => {
    userInfoFunction();
    userProfile();
    handleBannerAds("banner");
    handleNativeCardAds("nativeCard");
    return () => {};
  }, [logged]);

  const logged = userStatus.logged;

  const handleCategoryClick = (categoryname) => {
    if (categoryname === active) {
      setActive("All");
    } else {
      setActive(categoryname);
    }
  };

  useEffect(() => {
    const filteredData = events.filter((event) => {
      let isMatch = true;
      if (active !== "All") {
        isMatch = isMatch && event.category === active;
      }
      return isMatch;
    });
    setFilteredEvent(filteredData);

    return () => {};
  }, [active, events]);

  const handleStatusClick = (type, category) => {
    if (category !== status) {
      if (type === "thisweek") {
        //filter events in this week
        setApi(Connection.url + Connection.WeekEvents);
      } else if (type === "upcoming") {
        //filter upcoming events
        setApi(Connection.url + Connection.UpcomingEvents);
      } else if (type === "happening") {
        //filter events happening today
        setApi(Connection.url + Connection.TodayEvents);
      } else if (type === "featured") {
        setApi(Connection.url + Connection.FeaturedEvent);
      }
      setStatus(category);
    }
  };

  const handleUserAction = (reaction) => {
    setShowCardAd(false);
    UserInteraction(AdsInfo, reaction);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background.darker }]}
    >
      <StatusBar backgroundColor={theme.primary.main} barStyle="dark-content" />
      <View>
        <View
          //to component container
          // profile avatar, App name and search is included inside the component
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

        <View style={styles.homebody}>
          {connection ? (
            <ScrollView
              style={styles.homescrollview}
              showsVerticalScrollIndicator={false}
              stickyHeaderIndices={[3]}
            >
              {showBannerAds && <Slider ad={bannerAds} />}

              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Category.map((item, index) => (
                    <Categories
                      key={index}
                      icon={item.icon}
                      category={item.name}
                      border={item.color}
                      background={
                        active === item.name
                          ? item.color
                          : theme.background.main
                      }
                      color={
                        active === item.name
                          ? Constants.background
                          : Constants.Inverse
                      }
                      onPress={() => handleCategoryClick(item.name)}
                    />
                  ))}
                </ScrollView>
              </View>
              <Divider />
              <View style={{ backgroundColor: theme.background.darker }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {EventStatus.map((item, index) => (
                    <Statuses
                      key={index}
                      category={item.name}
                      border={item.color}
                      background={
                        status === item.name
                          ? theme.primary.main
                          : theme.background.main
                      }
                      color={
                        status === item.name
                          ? Constants.Inverse
                          : Constants.Inverse
                      }
                      check={status === item.name ? true : false}
                      onPress={() => handleStatusClick(item.type, item.name)}
                    />
                  ))}
                </ScrollView>
              </View>

              {loading ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader size="large" />
                </View>
              ) : filteredEvent.length == 0 ? (
                <NotFound
                  image={require("../../assets/images/noevent.png")}
                  helperText={`No ${status} Event `}
                  title=""
                />
              ) : (
                filteredEvent.map((item, index) => (
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
                ))
              )}

              {showCardAd && (
                <View
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <NativeAdsOne
                    ad={AdsInfo}
                    hideCard={() => handleUserAction("closed")}
                  />
                </View>
              )}
            </ScrollView>
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

  homebody: {
    marginTop: 70,
  },
  homescrollview: {
    marginBottom: 52,
  },
  title: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    marginLeft: 10,
    marginTop: 6,
    marginBottom: 2,
  },
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
});

export default Home;
