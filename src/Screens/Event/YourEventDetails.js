import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
  TouchableNativeFeedback,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "react-native-vector-icons";
import Constants from "../../constants/Constants";
import DetailContent from "../../Components/Events/EventContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../../constants/connection";
import { AuthContext } from "../../Components/context";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
import { bookmarkItem, remove } from "../../Reducer/saveSlice";
import Share from "react-native-share";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Divider } from "react-native-paper";

//import {writeJsonFile} from 'write-json-file';

const YoursDetail = ({ route, navigation }) => {
  const { item } = route.params; // an event item received from homepage flatlist will passed to this screen through route params
  const { userStatus } = React.useContext(AuthContext); //wether user is loged or not is retrieved from our context
  const logged = userStatus.logged;

  //get current to check weather event is expired or not

  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();
  var currentDate = year + "-" + month + "-" + day;

  //dispatch bookmarking item
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  // featuredImage asset location on the server
  var featuredImageUri = Connection.url + Connection.assets;
  /********************* */
  // event bookmarking related code is writen below
  /********************* */
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT); //message to be toasted after user clicked the bookmark button
  };

  const [bookmarkBtn, setBookmarkBtn] = useState(false);
  const [bookmarkBtnColor, setBookmarkBtnColor] = useState(Constants.Inverse);

  const bookmarkEvent = () => {
    const find = items.find((event) => event.event_id === item.event_id);
    if (find) {
      //setBookmarkBtn(true);
      setBookmarkBtnColor(Constants.Secondary);
      dispatch(remove(item.event_id));
      showToast("Unsaved!");
    } else {
      dispatch(bookmarkItem(item));
      // setBookmarkBtn(true);
      setBookmarkBtnColor(Constants.primary);
      showToast("Saved!");
    }
  };
  //check bookmarked button state

  const bookmarked = () => {
    var yesItis = false;
    const find = items.find((event) => event.event_id === item.event_id);
    if (find) {
      //setBookmarkBtn(true);
      setBookmarkBtnColor(Constants.primary);
      yesItis = true;
      return yesItis;
    }
    return yesItis;
  };

  // alert when user doesn't logged into the system
  const SignInAlert = () =>
    Alert.alert("Bookmark", "SignIn first to bookmark the event!", [
      {
        text: "Cancel",

        style: "cancel",
      },
      {
        text: "SignIn",
        onPress: () => navigation.navigate("SignIn"),
        style: styles.signInBtn,
      },
    ]);

  /******************************************* */
  //event Sharing functionality related code is writen below
  /******************************************* */
  const ShareEvent = async () => {
    let remoteUrl = featuredImageUri + item.event_image; //file path on the server
    let event_image = item.event_image; //name of image to be shared

    let localPath = `${FileSystem.cacheDirectory}${event_image}`; //cached file url
    FileSystem.downloadAsync(remoteUrl, localPath); //download file to cached directory

    const doesExist = await FileSystem.getInfoAsync(localPath);

    var weblink = Constants.webLink;

    const shareOptions = {
      url: localPath,
      title: item.event_name,
      message: "Check out this event on Place to be Ethiopia" + " " + weblink,
    };

    await Share.open(shareOptions).catch((err) => {});
  };
  /********************************************* */
  //event start date time and end date related code is writen below
  /********************************************* */

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

  /********************************************** */
  //read more description button related code  is writen below
  /******************************************** */
  const [read, setRead] = useState(5);
  const [readMorebtn, setReadMorebtn] = useState(false);
  const [textLength, setTextLength] = useState(read);

  const onTextLayout = React.useCallback((e) => {
    const lineLength = e.nativeEvent.lines.length; // get text line count

    if (lineLength > read) {
      setTextLength(lineLength);
      setReadMorebtn(true);
    }
  }, []);

  const [descLength, setDescLength] = useState("Read More");
  const showmore = () => {
    if (textLength > read) {
      setRead(textLength);
      setReadMorebtn(false);
      setDescLength("Read Less");
    } else {
      setRead(5);
      setReadMorebtn(false);
      setDescLength("Read More");
    }
  };

  //we call useeffect hook once the component get mounted
  useEffect(() => {
    // when component called featch organizer function will be called
    let isApiSubscribed = true;

    if (isApiSubscribed) {
      bookmarked();
    }
    // when the component get unmounted nothing is called we just pass empty return
    return () => {
      isApiSubscribed = false;
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Constants.background }}>
      <ScrollView
        scrollEventThrottle={16}
        style={{ backgroundColor: Constants.background }}
      >
        <View style={styles.featuredImageContainer}>
          <TouchableOpacity
            style={styles.backArrow} // back arrow button style
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={25}
              //back arrow icon
            />
          </TouchableOpacity>
          <Image
            //Featured Image of the event

            source={{ uri: featuredImageUri + item.event_image }} //featured image source
            resizeMode="cover"
            style={styles.image} //featured image styles
          />
        </View>

        <View style={styles.EventTitle}>
          <Text
            numberOfLines={1}
            style={styles.eventName} // event name on event detail section
          >
            {item.event_name}
          </Text>
          <View style={styles.actionButton}>
            {logged && bookmarked ? (
              <TouchableOpacity
                //bookmark button beside event title
                disabled={bookmarkBtn}
                activeOpacity={0.7}
                style={styles.bookmarkButton}
                onPress={() => bookmarkEvent()}
              >
                <Ionicons
                  name="bookmark"
                  size={18}
                  color={bookmarkBtnColor}
                  style={styles.bookmarkIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                //bookmark button beside event title
                activeOpacity={0.7}
                style={styles.bookmarkButton}
                onPress={() => SignInAlert()}
              >
                <Ionicons
                  name="bookmark"
                  size={18}
                  color={bookmarkBtnColor}
                  style={styles.bookmarkIcon}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.sharekButton}
              activeOpacity={0.7}
              onPress={() => ShareEvent()}

              // share event button
            >
              <Entypo name="share" size={18} style={styles.shareIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <DetailContent
          StartDate={DateFun(item.start_date)}
          StartTime={TimeFun(item.start_time)}
          EndDate={DateFun(item.end_date)}
          EndTime={TimeFun(item.end_time)}
          Price={item.event_entrance_fee}
          Venues={item.event_address}
          phone={item.contact_phone}
        />

        <View style={styles.TopButtons}>
          {item.event_entrance_fee !== "0" ? (
            <TouchableNativeFeedback
              onPress={() => navigation.navigate("Add Ticket", { item })}
            >
              <View style={styles.AddTicket}>
                <Text style={styles.addTicketText}>Add Ticket</Text>
              </View>
            </TouchableNativeFeedback>
          ) : null}

          <TouchableNativeFeedback
            onPress={() => navigation.navigate("Update Event", { item })}
          >
            <View style={styles.UpdateEvent}>
              <Text style={styles.UpdateEventText}>Update</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.descDescription}>
          <Text style={styles.descTitle}> Description</Text>

          <Text
            style={styles.desctext}
            numberOfLines={read}
            onTextLayout={onTextLayout}
          >
            {item.event_description}
          </Text>
          {readMorebtn ? (
            <TouchableOpacity activeOpacity={0.7} onPress={() => showmore()}>
              <Text style={styles.ReadMore}>{descLength}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: 5,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: Constants.background,
    height: 40,
    width: 40,
    borderRadius: 50,
    elevation: 2,
  },
  // Featurd Image style
  image: {
    flex: 1,
    width: "100%",
    height: 350,

    borderWidth: 2,
    borderRadius: 20,
  },
  //featured Image Container Styling
  featuredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "96%",
    height: "90%",
  },
  // add ticket and update Event container
  TopButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.icon,
    marginHorizontal: 20,
  },

  //addticket button
  AddTicket: {
    padding: 6,
    paddingHorizontal: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.primary,
    borderRadius: 50,
    margin: 2,
  },

  //add ticket text styling
  addTicketText: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
  },
  //Update event button
  UpdateEvent: {
    padding: 6,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.background,
    borderRadius: Constants.borderRad,
    margin: 2,
    elevation: 2,
    shadowColor: Constants.Secondary,
    borderWidth: 0.5,
    borderColor: Constants.primary
  },

  //Update event text styling
  UpdateEventText: {
 
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.primary,
  
  },
  // organizers section styling
  organizersSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  //organizers profile styling
  organizerProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: Constants.primary,
  },
  //organizer information section style
  orgInfoContainer: {
    justifyContent: "center",
    alignSelf: "center",
  },
  // organizer name style
  orgName: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Boldtwo,
    color: Constants.mainText,
    marginTop: 2,
  },
  // organizer operation category style
  orgCategory: {
    fontWeight: Constants.Boldtwo,
    color: Constants.mainTwo,
    alignSelf: "center",
  },
  // follow button style
  orgFollowBtn: {
    width: 130,
    borderRadius: Constants.tiny,
    padding: Constants.padd,
    paddingHorizontal: 20,
    margin: 10,
  },
  // follow button text style
  orgFollowTxt: {
    color: Constants.textColor,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    textAlign: "center",
  },
  EventTitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    marginTop: 2,
    paddingLeft: 10,
  },
  actionButton: {
    position: "absolute",
    right: 5,
    top: 0,
    width: "20%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  eventName: {
    width: "79%",
    marginTop: 5,
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    color: Constants.mainText,
    paddingRight: 4,
  },
  bookmarkButton: {
    borderRadius: 50,
    padding: 8,
    margin: 5,
    backgroundColor: Constants.Faded,
  },
  bookmarkIcon: {},
  sharekButton: {
    borderRadius: 50,
    padding: 8,
    margin: 5,
    backgroundColor: Constants.Faded,
  },
  descDescription: {
    flex: 2,
    margin: 10,
    marginLeft: 20,
  },
  descTitle: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.mainText,
  },
  desctext: {
    margin: 5,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
  },
  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 450,
    marginBottom: 70,
    paddingTop: 5,
  },
  mapInfo: {
    flexDirection: "column",
    alignSelf: "flex-start",
    paddingLeft: "8%",
    marginVertical: 10,
  },
  location: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.mainText,
  },
  venueOnMap: {
    fontSize: Constants.thirty,
    color: Constants.mainTwo,
  },
  map: {
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 20,
  },
  ticketBtnContainer: {
    width: "80%",
    position: "relative",
    alignSelf: "center",
    justifyContent: "center",
  },
  buyticketbtn: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    backgroundColor: Constants.primary,
    padding: 12,
    borderRadius: 50,
    justifyContent: "center",
    textAlign: "center",
  },
  ticketTxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    textAlign: "center",
    color: Constants.textColor,
  },
  ReadMore: {
    fontWeight: Constants.Bold,
    color: Constants.purple,
    padding: 6,
    marginLeft: 6,
    fontStyle: "italic",
  },
  orgConatinerShimmer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  orgProfileShimmer: {
    backgroundColor: Constants.Faded,
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  orgNameShimmer: {
    backgroundColor: Constants.Faded,
    padding: 10,
    width: 140,
    borderRadius: Constants.tiny,
    marginTop: 8,
  },
  orgCategoryShimmer: {
    backgroundColor: Constants.Faded,
    padding: 6,
    width: 100,
    borderRadius: Constants.tiny,
    marginTop: 7,
  },
  orgButtonShimmer: {
    backgroundColor: Constants.Faded,
    padding: 12,
    width: 100,
    borderRadius: Constants.tinybox,
    marginTop: 12,
    marginBottom: 15,
  },
  signInBtn: {
    borderRadius: Constants.tiny,
    padding: Constants.padd,
    paddingHorizontal: 20,
    margin: 10,
  },
});
export default YoursDetail;
