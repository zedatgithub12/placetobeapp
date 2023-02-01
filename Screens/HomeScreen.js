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
import Constants from "../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
import MyTabs from "./TopTab";
import { Divider, Title } from "react-native-paper";
import { AuthContext } from "../Components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../constants/connection";
import { SliderBox } from "react-native-image-slider-box";
import Categories from "../Components/CategoryListing";
import Category from "../src/Category";
import TicketCard from "../Components/TicketCard";
import TicketData from "../src/Tickets";
import FeaturedEvent from "../Components/FeaturedEvents";
import FeaturedShimmer from "../Components/FeaturedEventsShimmer";
import TicketShimmer from "../Components/TicketShimmer";




function Home({ navigation, ...props }) {
  const { userStatus, userInfoFunction } = React.useContext(AuthContext);

  const [Tickets, setTickets] = useState();
  const [ticketShimmer, setTicketShimmer] = useState(true);
  const [events, setEvents] = useState();
  const [eventShimmer, setEventShimmer] = useState(true);

  const profile = () => {
    navigation.navigate("Profile");
    userProfile();
  };

  var placeHoldersImage = "placeholders.jpg";

  const PlaceholderImages = [
    {
      id: "1",
      image: placeHoldersImage,
    },
    {
      id: "2",
      image: placeHoldersImage,
    },
    {
      id: "3",
      image: placeHoldersImage,
    },
    {
      id: "4",
      image: placeHoldersImage,
    },
    {
      id: "5",
      image: placeHoldersImage,
    },
    {
      id: "6",
      image: placeHoldersImage,
    },
    {
      id: "7",
      image: placeHoldersImage,
    },
    {
      id: "8",
      image: placeHoldersImage,
    },
  ];
  // state of featured image
  const [featured, setImage] = useState(PlaceholderImages);
  //a function which featches featured-image on the top of home screen from database
  // then the function will be called on the component mounting

  const featchImage = () => {
    var ApiUrl = Connection.url + Connection.Images;
    var headers = {
      Accept: "application/json",
      "Content-Type": "appliction/json",
    };

    fetch(ApiUrl, {
      method: "post",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;

        if (message === "succeed") {
          var featuredImages = response[0].images;
          // // console.log(featuredImages);
          // const featureImages = [];
          // const lastArray = [];
          // for (var i = 0; i <= featuredImages.length; i++) {
          //   var networkaddress = Connection.url + Connection.assets;
          //   featureImages.push(networkaddress + featuredImages[i].image);
          //   lastArray = featureImages[featureImages.length -1];
          //   console.log(featuredImages);
          // }

          setImage(featuredImages);
        } else {
          setImage(Images);
        }
      })
      .catch((error) => {
        setImage(Images);
      });
  };

  //list of image to be added on the top crousel
  var firstImage = featured[0].image;
  var secondImage = featured[1].image;
  var thirdImage = featured[2].image;
  var fourthImage = featured[3].image;
  var fifthImage = featured[4].image;
  var sixthImage = featured[5].image;
  var seventhImage = featured[6].image;
  var eightImage = featured[7].image;

  const Images = [
    Connection.url + Connection.assets + firstImage,
    Connection.url + Connection.assets + secondImage,
    Connection.url + Connection.assets + thirdImage,
    Connection.url + Connection.assets + fourthImage,
    Connection.url + Connection.assets + fifthImage,
    Connection.url + Connection.assets + sixthImage,
    Connection.url + Connection.assets + seventhImage,
    Connection.url + Connection.assets + eightImage,
  ];

  // function to set user profile while user is logged in
  const [userPhoto, setUserphoto] = useState("maleProfile.jpg");

  const userProfile = async () => {
    var userId = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.MetaData;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var data = {
      userId: userId,
    };
    //save user info into database
    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        var resp = response[0];

        if (resp.message === "succeed") {
          var userInfo = response[0].user[0];
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
      method: "POST",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;

        if (message === "succeed") {
          var tickets = response[0].tickets;
          setTickets(tickets);
          setTicketShimmer(false);
        } else {
          setTicketShimmer(true);
          console.log(message);
        }
      })
      .catch((error) => {
        console.log("Error ticket featching" + error);
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
      method: "POST",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;

        if (message === "succeed") {
          var FeaturedEvent = response[0].Events;
          setEvents(FeaturedEvent);
          setEventShimmer(false);
        } else {
          setEventShimmer(true);
        }
      })
      .catch((error) => {
        setEventShimmer(true);
        console.log(error);
      });
  };

  const [shown, setShown] = useState(true);
  useEffect(() => {
    userInfoFunction();
    featchImage();
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
              source={require("../assets/homebranding.png")}
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
          <Divider style={{ color: Constants.transparentPrimary }} />
          {shown ? (
            <ScrollView contentContainerStyle={{ minHeight: 180 }}>
              <SliderBox
                images={Images}
                dotColor={Constants.primary}
                inactiveDotColor={Constants.transparentPrimary}
                dotStyle={{
                  height: 9,
                  width: 9,
                  borderRadius: 8,
                }}
                firstItem={0}
                imageLoadingColor={Constants.Secondary}
                autoplay={true}
                autoplayInterval={5000}
                circleLoop={true}
                paginationBoxVerticalPadding={10}
                resizeMode="contain"
                activeOpacity={1.0}
              />
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
          <Pressable>
            <Ionicons
              name="md-grid-outline"
              size={18}
              color={Constants.Inverse}
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginLeft: 8,
            backgroundColor: Constants.background,
          }}
        >
          {ticketShimmer ? (
            <View style={{ flexDirection: "row" }}>
              <TicketShimmer />
              <TicketShimmer />
              <TicketShimmer />
              <TicketShimmer />
            </View>
          ) : (
            Tickets.map((item) => (
              <TicketCard
                key={item.id}
                picture={item.event_image}
                title={item.event_name}
                price={item.currentprice}
                type={item.tickettype}
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

        <View
          style={{ backgroundColor: Constants.background, marginBottom: 55 }}
        >
          {eventShimmer ? (
            <View>
              <FeaturedShimmer />
              <FeaturedShimmer />
              <FeaturedShimmer />
              <FeaturedShimmer />
            </View>
          ) : events.length == 0 ? (
            <View>
              <Text>No event</Text>
            </View>
          ) : (
            events.map((item) => (
              <FeaturedEvent
                key={item.event_id}
                picture={item.event_image}
                title={item.event_name}
                organizer={item.event_organizer}
                onPress={() =>
                  navigation.navigate("EventDetail", { id: item.event_id })
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
    backgroundColor: Constants.background,
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
    backgroundColor: Constants.background,
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
    marginTop:10,
    backgroundColor: Constants.background,
  },
  ticketTitle: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingone,
  },
});

export default Home;
