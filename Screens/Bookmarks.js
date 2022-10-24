import React,{useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View,StyleSheet, Text, Image,TouchableOpacity } from 'react-native';
import Constants from "../constants/Constants";
import { Title, Paragraph } from "react-native-paper";
import SavedEvent from '../Reducer/BookmarkedEvent';
import { remove } from '../Reducer/saveSlice';
import Listing from '../Components/ListShimmer';


function Bookmarks({ navigation }){

   const {items} = useSelector((state) => state.cart);
   const [loading, setLoading] = useState(false);
   //dispatch action hook
    const dispatch = useDispatch();
    
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
      const mount =()=>{
        setLoading(true);
      }
      useEffect(()=>{
        mount();
        return ()=>{}
      },[])

    return(
      <View style={{flex:1}}>
      {loading ? (
        <View style={styles.container}>

          {items.length !== 0 ? (
          <View>
          {items.map((item) => {
            return <SavedEvent key={item.event_id} {...item}
           
            FeaturedImage={item.event_image}
            name={item.event_name}
            date = {DateFun(item.start_date)}
            time = {TimeFun(item.start_time)}
            venue={item.event_address}
            Price={EntranceFee(item.event_entrance_fee)}
            onPress={() => navigation.navigate("EventDetail", { item })}
            removeItem = {() =>dispatch(remove(item.event_id))}
            />
          })}
        </View>
      ) : (
        <View style={styles.noBookmarkContainer}>
          <Image
            source={require("../assets/bookmark.png")}
            style={styles.noBookmarkImage}
            resizeMode="contain"
          />
          <Title style={styles.prompttxt}>No Bookmarks</Title>
          <Paragraph>Your bookmarked event will appear here.</Paragraph>
          <TouchableOpacity
            //this is a button which redirect user to today event listing in the home page
            style={styles.eventsBtn}
            activeOpacity={0.7}
            onPress={()=>navigation.navigate("Home")}
          >
            <Text style={styles.eventstxt}>Events</Text>
          </TouchableOpacity>
        </View>
      )}
        </View>

      )
      : 
      (
        <View>
      <Listing/>
      <Listing/>
      <Listing/>
      <Listing/>
      <Listing/>
      <Listing/>
      <Listing/>
      </View>
      )
}
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        backgroundColor:Constants.background,
    
    },
    noBookmarkContainer: {
      flex:1,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
      },
      noBookmarkImage: {
        width: "85%",
        height: 200,
        borderRadius: 10,
      },
      prompttxt: {
        fontSize: Constants.primaryHeading,
        fontWeight: Constants.Bold,
        marginTop: 10,
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
      savedCount:{
        alignSelf:'flex-end',
        textAlign: 'center',
        marginRight:6,
        margin:10,
        backgroundColor: Constants.Danger,
        padding:3,
        width:30,
        height:30,
        borderRadius: 15,
        color: Constants.background,
        fontWeight:Constants.Bold,
        fontSize: Constants.headingtwo


      }
});

export default Bookmarks;