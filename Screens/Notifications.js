import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  ToastAndroid,
} from "react-native";
import { Title, Paragraph, HelperText } from "react-native-paper";
import { AuthContext } from "../Components/context";
import Notice from "../Components/Notice";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import NoticeShimmer from "../Components/NoticeShimmer";

const Notifications = ({ navigation }) => {
  // state from context from Context Hook

  const [notification, setNotification] = React.useState();
  const [notFound, setNotFound] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);


  // after list refreshed we call toast to tell user that the list is updated
  const refreshed = () => ToastAndroid.show("Refreshed!", ToastAndroid.SHORT);
  // refresh the list of notifications
  const RefreshList = async() => {
    setLoading(false);
    let id = await AsyncStorage.getItem("userId");
  

    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.notification;
    //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
    
    
    var userIdentity = {
      userId: id,
    };
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
   
    fetch(ApiUrl, {
      method: "POST",
      body: JSON.stringify(userIdentity),
      headers: headers,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        var message = response[0].message;
        
        if (isApiSubscribed) {
          // handle success
          const filter=(data)=>{
         return data !== null;
          }
          if (message === "succeed") {
            var result = response[0].Notification;
            var notice = result.filter(filter);
            
            setNotification(notice);
            setNotFound(false);
           setLoading(true);
          } else if (message === "no event") {
            setNotification(notice);
           setLoading(true);
            setNotFound(true);
          } 
          else if(message = "follow organizers"){
            setNotification(notice);
          setLoading(true);
            setNotFound(true);
          }
            else {
              setLoading(false);
          }
        }
      })
      .catch((err)=>{
        setLoading(false);
      });
   
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  };

  // convert date to suitable format for app
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
  //convert time to suitable format for an app
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
  // render flatlist item
  const renderNotice = ({ item }) => (
  
    <Notice
    Event_Id={item.event_id}
      organizerName={item.event_organizer}
      noticeTitle={item.event_name}
      date={DateFun(item.start_date)}
      time={TimeFun(item.start_time)}
      onPressNotice={() => navigation.navigate("EventDetail", { item })}
    />
  );

  useEffect(() => {
    RefreshList();
   
    return () => {};
  },[]);

  return (
    <View>
      {loading ? 
      (
        <FlatList
        data={notification}
        renderItem={renderNotice}
        keyExtractor={(item) => item.event_id}
        onRefresh={RefreshList}
        refreshing={refreshing}
        ListHeaderComponent={() =>
          notFound ? (
            <View style={styles.noNoticeContainer}>
              <Image
                source={require("../assets/noNotification.png")}
                style={styles.noNoticeImage}
                resizeMode="contain"
              />
              <Title style={styles.prompttxt}>
                You have no Notification Yet!
              </Title>
              <Paragraph>you will receive one soon</Paragraph>
            </View>
          ) : null
        }
        ListFooterComponent={() => (
          notFound ? null
          :
          (
            <View style={styles.listEnd}>
            <HelperText>
              Events from organizers you followed.
            </HelperText>
           
          </View>
          )
        )}
      />
      ): (
        <View>
  <View>
    <NoticeShimmer/>
    <NoticeShimmer/>
    <NoticeShimmer/>
    <NoticeShimmer/>
    <NoticeShimmer/>
    </View>

    <View>
    <NoticeShimmer/>
    <NoticeShimmer/>
    <NoticeShimmer/>
   
    </View>
    </View>
      )
      }
    </View>
   
  );
};
const styles = StyleSheet.create({

  noNoticeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
    paddingTop: 200,
    paddingBottom: 280,
  },
  noNoticeImage: {
    width: "85%",
    height: 200,
    borderRadius: Constants.mediumbox,
  },
  prompttxt: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
  listEnd:{
    padding:20,
    backgroundColor:Constants.transparentPrimary,
    marginTop:5,
    margin:5,
    borderRadius:Constants.tinybox,
    marginBottom:62,
  }
});

export default Notifications;
