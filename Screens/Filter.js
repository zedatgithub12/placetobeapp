import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import {
  ActivityIndicator,
  Divider,
  Paragraph,
  Title,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Constants from "../constants/Constants";
import Category from "../src/Category";
import Events from "../Components/Events";
import Connection from "../constants/connection";
import Listing from "../Components/ListShimmer";

const Filter = ({ navigation, route }) => {
  const { item } = route.params;

  const [filterData, setFilterData] = React.useState(true);
  const [searchInput, setSearchInput] = React.useState("");
  const [inputs, setInputs] = React.useState({
    submitBtn: false,
  });
  const [search, setSearch] = React.useState();
  const [loading, setLoading] = useState(false);
  /************************************************** */
  // when user enter keys inside search box this function will be triggered
  /******************************************************** */
  const updateSearchKey = (text) => {
    setSearchInput(text);
    if (text.length <= 0) {
      setInputs({
        ...inputs.submitBtn,
        submitBtn: false,
      });
    } else {
      setInputs({
        ...inputs.submitBtn,
        submitBtn: true,
      });
    }
  };
  // clear text entered in search Field
  const ClearInputs = () => {
    setSearchInput("");
    setInputs({
      ...inputs.submitBtn,
      submitBtn: false,
    });
  };

  // state of search icon
  const [searching, setSearching] = useState(false);
  // search event
  const searchEvent = () => {
    setLoading(false);
    setSearching(true);
    // after the search button get pressed the state set to true
    const controller = new AbortController();
    const signal = controller.signal;
    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.search;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    var search = {
      searchInput: searchInput,
    };
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "POST",
      body: JSON.stringify(search),
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        var message = response[0].message;

        if (isApiSubscribed) {
          // handle success

          if (message === "succeed") {
            var searchResult = response[0].Filtered;
            setSearch(searchResult);
            setFilterData(true);
            setLoading(true);
            setSearching(false);
          } else if (message === "no event") {
            setFilterData(false);
            setLoading(true);
            setSearching(false);
          } else {
            setLoading(false);
            setSearching(false);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
      });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
      controller.abort();
    };
  };

  /********************************************************** */
  //filter event by category
  /********************************************************** */
  const EventCategory = (catname) => {
    setLoading(false);
    const controller = new AbortController();
    const signal = controller.signal;
    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.categoryFilter;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    var category = {
      category: catname,
    };
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "POST",
      body: JSON.stringify(category),
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        var message = response[0].message;

        if (isApiSubscribed) {
          // handle success

          if (message === "succeed") {
            var searchResult = response[0].Filtered;
            setSearch(searchResult);
            setFilterData(true);
            setLoading(true);
          } else if (message === "no event") {
            setFilterData(false);
            setLoading(true);
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
      });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
      controller.abort();
    };
  };
  /********************************************************** */
  //date function which perform date format conversion and return the suitable format for frontend
  /********************************************************** */
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
  
  const CategoryColor = (category) => {
    var color;
    switch (category) {
      case "Entertainment":
        color = "#E38B29";
        break;
      case "Travelling":
        color = "#422057";
        break;
      case "Business":
        color = "#61481C";
        break;
      case "Cinema & Theater":
        color = "#5ca803";
        break;
      case 4:
        day = "Thursday";
        break;
      case "Community":
        color = "#F96666";
        break;
      case "Trade Fairs & Expo":
        color = "#E38B29";
        break;
      case "Nightlife":
        color = "#472D2D";
        break;
      case "Professional":
        color = "#002B5B";
        break;
      case "Shopping":
        color = "#9306c2";
        break;
      case "Sport":
        color = "#576F72";
        break;
      case "Others":
        color = "#967E76";
        break;
      default:
        color = "#ffbb00";
    }
    return color;
  };
  //rendered event list
  const renderedItem = ({ item }) => (
    <Events
      Event_Id={item.event_id}
      org_id={item.userId}
      FeaturedImage={item.event_image}
      title={item.event_name}
      date={DateFun(item.start_date)}
      time={TimeFun(item.start_time)}
      venue={item.event_address}
      category={CategoryColor(item.category)}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("EventDetail", { item })}
    />
  );

  // rendering empty flatlist
  const listEmptyComponent = () => (
    <View style={styles.searchSuggestion}>
      <Ionicons
        name="search-outline"
        size={40}
        color={Constants.primary}
        style={styles.submitIcon}
      />
      <Title style={styles.prompttxt}>Search Events!</Title>
      <Paragraph>Your search result appear here.</Paragraph>
    </View>
  );

  //run component did mount and component unmounted
  useEffect(() => {
    EventCategory(item.name);
    return () => {};
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        // search and filter container
        style={styles.headers}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <AntDesign
            name="arrowleft"
            size={20}
            color={Constants.Inverse}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View
          style={styles.SearchFieldContainer}
          //search icon and text field container
        >
          <TextInput
            //a text input which enables user to search for specific data they are looking for
            placeholder="Search..."
            style={styles.SearchField}
            value={searchInput}
            onChangeText={(text) => updateSearchKey(text)}
            onSubmitEditing={() => searchEvent()}
          />
          {inputs.submitBtn ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => ClearInputs()}
            >
              <AntDesign name="close" size={16} color={Constants.Inverse} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          //filter button container
          activeOpacity={0.8}
          style={styles.submitSearch}
          onPress={() => searchEvent()}
        >
          {searching ? (
            <ActivityIndicator
              size="small"
              color={Constants.primary}
              style={styles.submitIcon}
            />
          ) : (
            <Ionicons
              name="search-outline"
              size={20}
              color={Constants.primary}
              style={styles.submitIcon}
            />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        filterData ? (
          <FlatList
            // List of events in extracted from database in the form JSON data
            data={search}
            renderItem={renderedItem}
            keyExtractor={(item) => item.event_id}
            ListEmptyComponent={() => listEmptyComponent()}
            style={styles.filteredEventList}
          />
        ) : (
          <View style={styles.noResultContainer}>
            <Ionicons
              name="search-outline"
              size={50}
              color={Constants.primary}
              style={styles.submitIcon}
            />
            <Title style={styles.prompttxt}>No result found!</Title>
            <Paragraph>Your search result appear here.</Paragraph>
          </View>
        )
      ) : (
        <View>
          <Listing />
          <Listing />
          <Listing />
          <Listing />
          <Listing />
          <Listing />
          <Listing />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
  },
  // search and filter container
  headers: {
    width: "96%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: Constants.paddTwo,
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 15,
  },
  SearchFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "74%",
    backgroundColor: Constants.Faded,
    borderRadius: 50,
    padding: 6,
    paddingLeft: 10,
    elevation: 1,
    shadowColor: Constants.Faded,
  },
  backArrow: {
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.Faded,
    borderRadius: 20,
    padding: 4,
  },
  backIcon: {
    margin: 3,
  },
  SearchField: {
    width: "78%",
    marginLeft: 10,
  },
  submitSearch: {
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.transparentPrimary,
    borderRadius: 20,
    padding: 4,
  },
  submitIcon: {
    margin: 3,
  },
  categoryList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    padding: 5,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: Constants.borderRad,
    shadowColor: Constants.background,
  },
  clearButton: {
    padding: 5,
  },
  //Category name
  catName: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.background,
  },
  //category flatlist styling
  catFlatlist: {
    position: "relative",
  },
  filteredEventList: {},

  noResultContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 70,
    backgroundColor: Constants.background,
  },
  searchSuggestion: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "17%",
  },
  noResultImage: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  prompttxt: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
});

export default Filter;
