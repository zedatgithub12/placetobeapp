import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Constants from "../constants/Constants";
import VenuePotential from "../Components/VenuePotential";
import Sevices from "../Components/VenueServices";
import EventMap from "../Components/eventMap";
import Events from "../Components/Events";
import Data from "../assets/Data";

const VenueDetail = ({ route, navigation, props }) => {
  const { item } = route.params;
  const renderItem = ({ item }) => (
    <Events
      FeaturedImage={item.FeaturedImage}
      title={item.title}
      date={item.date}
      time={item.time}
      venue={item.venue}
      Price={item.Price}
      onPress={() => navigation.navigate("EventDetail", { item })}
    />
  );
  return (
    <SafeAreaView style={{  backgroundColor: Constants.background }}>
      <ScrollView
      indicatorStyle={{flex: 2}}
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
            source={item.FeaturedImage} //featured image source
            resizeMode="cover"
            style={styles.image} //featured image styles
          />
        </View>

        <VenuePotential
          name={item.title}
          Slots={item.parkingSlot}
          RoomKeys={item.numberOfRoom}
          RoomPrice={item.roomPrice}
        />

        <View
          // Venue Description Container
          style={styles.venueDescription}
        >
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.venueDesctxt} numberOfLines={5}>
            {item.description}
          </Text>
          <Text style={styles.ReadMore}>Read More</Text>
        </View>
        <Sevices />
        <View
          style={styles.mapContainer} // event venue location map
        >
          <View style={styles.mapInfo}>
            <Text style={styles.location}>Location</Text>
            <Text style={styles.venueOnMap}>{item.venue}</Text>
          </View>

          <EventMap
            latitudeValue="9.00479"
            longitudeValue="38.7775579"
            style={styles.venueMap}
            //july 21 last edited section
            //next time you can start by calculating longitude and latitudeDelta
          />
        </View>
    
        <View
          //Events on the Venue section Container
          style={styles.eventsOnVenueContainer}
        >
          <Text style={styles.venueEvents}>Events on the Venue</Text>
          <FlatList
            // List of events in extracted from database in the form JSON data
            data={Data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
          />
        </View>
      </ScrollView>


      <View
        style={styles.contactBtnContainers}
        //Container of Bottom Buttons
        //which contain call and visit website Buttons
      >
        <TouchableOpacity activeOpacity={0.6} style={styles.callBtn}>
          <Ionicons name="call" size={16} style={styles.actionBtn} />
          <Text style={styles.ticketTxt}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} style={styles.visitWebButton}>
          <MaterialCommunityIcons
            name="web"
            size={16}
            style={styles.actionBtn}
          />
          <Text style={styles.ticketTxt}>Visit Website</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  //featured Image Container Styling
  featuredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "98%",
    height: 320,
    backgroundColor: Constants.background,
  },
  //back arrow container styles
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
    height: "11%",
    width: "11%",
    borderRadius: 50,
    elevation: 2,
  },
  // Featurd Image style
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: Constants.icon,
    borderWidth: 2,
    borderRadius: 20,
  },

  descTitle: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
  },
  venueDescription: {
    margin: 10,
    marginTop: 15,
    paddingHorizontal: 15,
  },
  venueDesctxt: {
    marginTop: 6,
    fontSize: Constants.thirty,
    fontFamily: "Roboto",
    fontWeight: Constants.Boldtwo,
    color: Constants.mainTwo,
    marginLeft: 7,
  },
  ReadMore: {
    fontWeight: Constants.Bold,
    color: Constants.primary,
    padding: 6,
  },
  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 450,
    marginBottom: 15,
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
  venueMap: {
    borderRadius: 20,
  },
  contactBtnContainers: {
    width: "80%",
    position: "relative",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  callBtn: {
    flexDirection: "row",
    width: "30%",
    position: "absolute",
    bottom: 20,
    left: 10,
    backgroundColor: Constants.primary,
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  visitWebButton: {
    flexDirection: "row",
    width: "60%",
    position: "absolute",
    bottom: 20,
    right: 10,
    backgroundColor: Constants.Faded,
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  ticketTxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    textAlign: "center",
    color: Constants.textColor,
  },
  eventsOnVenueContainer: {

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 70,
    paddingTop: 5,
    backgroundColor: Constants.background,
  },
  venueEvents: {
    alignSelf: "flex-start",
    paddingLeft: "8%",
    marginVertical: 10,
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.mainText,
  },
});

export default VenueDetail;
