import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Connection from "../../../constants/connection";
import Constants from "../../../constants/Constants";
import TicketListing from "../../../Components/Tickets/TicketsListing";
import Header from "./HeaderActions";
import Modal from "react-native-modal";
import UpcomingEvents from "./UpcomingEvents";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as Animatable from "react-native-animatable";
import NoTicket from "../../../handlers/Tickets";

// ticket functional component
function Tickets({ navigation }) {
  const [loading, setLoading] = React.useState(true);
  const [tickets, setTickets] = React.useState([]); //tickets
  const [refreshing, setRefreshing] = React.useState(false); //flalist refreshing state

  const myTickets = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    setRefreshing(true);

    let id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.myTickets + id;
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
          setLoading(false);
          setTickets(response.data);
          setRefreshing(false);
        } else {
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      // cancel the request before component unmounts
      controller.abort();
    };
  };
  const ActiveTickets = tickets.filter((ticket) => ticket.status == "1");

  //Upcoming event listed in bottom sheet modal is listed here
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadUpcoming, setLoadUpcoming] = useState(true);
  const [message, setMessage] = useState();
  const [notFound, setNotFound] = useState(false);

  const handleUpcomingEvents = async () => {
    setLoadUpcoming(true);

    // featching abort controller
    // after featching events the fetching function will be aborted
    const controller = new AbortController();
    const signal = controller.signal;

    let id = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.organizerUpcomings + id;

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
          var todayEvents = response.data;
          setUpcomingEvents(todayEvents);
          setLoadUpcoming(false);
        } else {
          setLoadUpcoming(false);
        }
      })
      .catch(() => {
        console.log(error);
        setLoadUpcoming(false);
      });

    return () => {
      // cancel the subscription
      controller.abort();
    };
  };
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
  const renderEvent = ({ item }) => (
    <UpcomingEvents
      event_name={item.event_name}
      start_date={DateFun(item.start_date)}
      onPress={() => navigation.navigate("Add Ticket", { item })}
    />
  );
  const filterUpcomings = upcomingEvents.filter((event) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    return event.start_date >= today;
  });
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);

    if (upcomingEvents.length == 0) {
      handleUpcomingEvents();
    }
  };
  //ticket type icon
  const TicketName = (iconname) => {
    var name;
    switch (iconname) {
      case "Early Bird":
        name = "bird";
        break;

      case "Regular":
        name = "ticket";
        break;

      case "VIP":
        name = "star-outline";
        break;

      case "VVIP":
        name = "star-shooting-outline";
        break;

      case "Student":
        name = "book-education-outline";
        break;

      case "Kids":
        name = "baby-face-outline";
        break;

      case "Adult":
        name = "face-man";
        break;

      case "Member":
        name = "account-group-outline";
        break;

      default:
        name = "ticket";
    }
    return name;
  };

  //ticket icon color
  const TicketColor = (iconname) => {
    var Color;

    switch (iconname) {
      case "Early Bird":
        Color = "#ff24da";
        break;

      case "Regular":
        Color = "#00a2ff";

        break;

      case "VIP":
        Color = "#ffc800";

        break;

      case "VVIP":
        Color = "#ffb300";

        break;

      case "Student":
        Color = "#00c4de";

        break;

      case "Kids":
        Color = "#ff3686";

        break;

      case "Adult":
        Color = "#ff551c";

        break;

      case "Member":
        Color = "#5fcc41";

        break;

      default:
        Color = "#ffbb00";
    }
    return Color;
  };
  // ticket status
  const Status = (Tstatus) => {
    var ticketStatus;

    switch (Tstatus) {
      case "0":
        ticketStatus = "Pending";
        break;

      case "1":
        ticketStatus = "In-Stock";
        break;

      case "2":
        ticketStatus = "Declined";
        break;

      case "3":
        ticketStatus = "Sold-out";
        break;

      default:
        ticketStatus = "Pending";
    }
    return ticketStatus;
  };

  //status text color
  const StatusText = (textColor) => {
    var StatusColor;

    switch (textColor) {
      case "0":
        StatusColor = "#787878";
        break;

      case "1":
        StatusColor = "#0bb321";
        break;

      case "2":
        StatusColor = "#ff3d4d";
        break;

      case "3":
        StatusColor = "#787878";
        break;

      default:
        StatusColor = "#787878";
    }
    return StatusColor;
  };
  // refresh ticket listing
  const RefreshList = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    setRefreshing(true);

    let id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.myTickets + id;
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
          setLoading(false);
          setTickets(response.data);
          setRefreshing(false);
        } else {
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      // cancel the request before component unmounts
      controller.abort();
    };
  };

  // render ticket listing
  const renderItem = ({ item }) => (
    <TicketListing
      event={item.event_name}
      type={item.tickettype}
      price={item.currentprice}
      iconName={TicketName(item.tickettype)}
      iconColor={TicketColor(item.tickettype)}
      status={Status(item.status)}
      textColor={StatusText(item.status)}
      onPress={() => navigation.navigate("Ticket Detail", { item })}
      longPress={() => navigation.navigate("Update Ticket", { item })}
    />
  );

  useEffect(() => {
    let isApiSubscribed = true;

    if (isApiSubscribed) {
      myTickets();
    }

    return () => {
      isApiSubscribed = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: Constants.background, marginBottom: 6 }}>
        <Header activeTickets={ActiveTickets.length} addTicket={toggleModal} />
      </View>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color={Constants.primary} />
        </View>
      ) : (
        <FlatList
          data={tickets}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onRefresh={RefreshList}
          refreshing={refreshing}
          ListEmptyComponent={
            <NoTicket
              title="Not Found, Create One!"
              helperText="Ticket you added to the events are listed here"
            />
          }
        />
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.bottomsheetcontainer}
      >
        <Animatable.View
          animation="slideInUp"
          duration={0.5}
          style={styles.bottomsheet}
        >
          <View style={styles.sheetHeader}>
            <Text
              style={{
                fontSize: Constants.headingtwo,
                fontWeight: Constants.Boldtwo,
              }}
            >
              Upcoming Events
            </Text>

            <TouchableOpacity style={styles.closebtn} onPress={toggleModal}>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={Constants.Inverse}
              />
            </TouchableOpacity>
          </View>

          {loadUpcoming ? (
            <View>
              <ActivityIndicator size="large" color={Constants.primary} />
            </View>
          ) : (
            <FlatList
              data={filterUpcomings}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <View style={styles.noevent}>
                  <Image
                    source={require("../../../assets/images/NotFound.png")}
                    resizeMode="contain"
                    style={styles.notFound}
                  />
                  <Text style={styles.emptyMessageStyle}>
                    You have no upcoming event!
                  </Text>
                </View>
              }
            />
          )}
        </Animatable.View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Faded,
    paddingBottom: 6,
  },

  eventsBtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.primary,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventstxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
  },

  bottomsheetcontainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomsheet: {
    backgroundColor: Constants.Faded,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopLeftRadius: 14,
    borderTopEndRadius: 14,
    minHeight: 400,
    maxHeight: Dimensions.get("screen").height / 1.5,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 4,
    marginBottom: 18,
  },
  closebtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 18,
  },
  noevent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    width: "75%",
    height: 180,
    borderRadius: 10,
  },
  emptyMessageStyle: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    marginTop: 10,
    color: Constants.Secondary,
  },
});

export default Tickets;
