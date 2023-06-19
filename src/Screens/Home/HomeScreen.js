import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../../constants/Constants";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import { Divider } from "react-native-paper";
import { AuthContext } from "../../Components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../../constants/connection";
import Categories from "../../Components/Categories/CategoryListing";
import Category from "../../dummies/Category";
import TicketCard from "../../Components/Tickets/TicketCard";
import TicketShimmer from "../../Components/Tickets/Skeleton/TicketShimmer";
import Events from "../../Components/Events/Events";
import Listing from "../../Components/Events/Skeleton/ListShimmer";
import { LocalNotification } from "../../Utils/localPushController";
import Slider from "../../Components/Slider";

function Home({ navigation, ...props }) {
  const { userStatus, userInfoFunction } = React.useContext(AuthContext);
  const [Tickets, setTickets] = useState([]);
  const [ticketShimmer, setTicketShimmer] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventShimmer, setEventShimmer] = useState(true);
  const d = new Date();
  let Hour = d.getHours();
  let minute = d.getMinutes();

  // notification arrival time in human readable format
  const ArrivalTime = () => {
    var time;
    if (Hour > 12) {
      time = Hour - 12 + ":" + minute + " pm";
    } else if (Hour == 12) {
      time = Hour + ":" + minute + " pm";
    } else {
      time = Hour + ":" + minute + " am";
    }

    return time;
  };

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
    var ApiUrl = Connection.url + Connection.FeaturedEvent;
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
  /********************************************************** */
  //date function which perform date format conversion and return the suitable format for frontend
  /********************************************************** */
  const DateFun = (startingDate) => {
    var date = new Date(startingDate);
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
  // events category color
  const CategoryColor = (category) => {
    var color;
    switch (category) {
      case "Entertainment":
        color = "#007bc2";
        break;
      case "Travelling":
        color = "#0c790c";
        break;

      case "Cinema & Theater":
        color = "#00e8e0";
        break;

      case "Community":
        color = "#F96666";
        break;
      case "Trade Fairs & Expo":
        color = "#f57a00";
        break;
      case "Nightlife":
        color = "#472D2D";
        break;
      case "Professional":
        color = "#2c2e27";
        break;
      case "Shopping":
        color = "#9306c2";
        break;
      case "Sport":
        color = "#ff0571";
        break;
      case "Others":
        color = "#e8b200";
        break;
      default:
        color = "#ffbb00";
    }
    return color;
  };

  // check if there is discount on ticket price and let them know there is discount
  const discount = (current, origional) => {
    var discount = origional - current;

    if (discount > 0) {
      return origional + " Birr";
    } else {
      return discount;
    }
  };

  //image to be used in notification
  const featuredImageUri =
    Connection.url + Connection.assets + "Placeholder.png";
  const NotificationIcon = Connection.url + Connection.assets + "favicon.png";

  const [shown, setShown] = useState(true);

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
      <ScrollView>
        <View
          //to component container
          // profile avatar, App name and serach is included inside the component
          style={styles.headers}
        >
          <View style={styles.brands}>
            <Image
              source={require("../../assets/images/homebranding.png")}
              resizeMode="cover"
              style={{ width: 152, height: 70 }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.searchBtn}
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
          <Divider style={{ color: Constants.background }} />

          {shown ? (
            <ScrollView contentContainerStyle={{ minHeight: 180 }}>
              {/* promo slide component  */}
              <Slider />

              <View>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.categories}
                  showsHorizontalScrollIndicator={false}
                >
                  {Category.map((item) => (
                    <Categories
                      key={item.id}
                      icon={item.icon}
                      category={item.name}
                      color={item.background}
                      onPress={() => navigation.push("Filter", { item })}
                    />
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          ) : null}
        </View>

        <View style={styles.availableTickets}>
          <Text style={styles.ticketTitle}>Available Tickets</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginLeft: 8,
            paddingRight: 12,
          }}
        >
          {ticketShimmer ? (
            <View style={{ flexDirection: "row" }}>
              <TicketShimmer />
              <TicketShimmer />
              <TicketShimmer />
              <TicketShimmer />
            </View>
          ) : Tickets.length == 0 ? (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>There is no Tickets</Text>
            </View>
          ) : (
            Tickets.map((item) => (
              <TicketCard
                key={item.id}
                picture={item.event_image}
                title={item.event_name}
                type={item.tickettype}
                price={item.currentprice}
                discount={discount(item.currentprice, item.origionalprice)}
                EventName={() =>
                  navigation.navigate("EventDetail", { id: item.event_id })
                }
                onPress={() => navigation.navigate("TicketScreen", { item })}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.availableTickets}>
          <Text style={styles.ticketTitle}>Featured Events</Text>
          <Pressable>
            <Ionicons
              onPress={() => navigation.navigate("Events")}
              name="md-grid-outline"
              size={18}
              color={Constants.Inverse}
            />
          </Pressable>
        </View>

        <View style={{ marginBottom: 55 }}>
          {eventShimmer ? (
            <View>
              <Listing />
              <Listing />
              <Listing />
            </View>
          ) : events.length == 0 ? (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>There is no Featured</Text>
            </View>
          ) : (
            events.map((item) => (
              <Events
                key={item.id}
                Event_Id={item.id}
                org_id={item.userId}
                FeaturedImage={item.event_image}
                title={item.event_name}
                date={DateFun(item.start_date)}
                time={TimeFun(item.start_time)}
                venue={item.event_address}
                category={CategoryColor(item.category)}
                Price={EntranceFee(item.event_entrance_fee)}
                onPress={() =>
                  navigation.navigate("EventDetail", { id: item.id })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  headers: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: Constants.paddTwo,
    alignSelf: "center",
    marginBottom: 10,
    position: "absolute",
    top: 0,
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
    marginTop: 80,
  },
  categories: {
    paddingHorizontal: 6,
  },
  availableTickets: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    marginTop: 10,
  },
  ticketTitle: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
  },
});

export default Home;