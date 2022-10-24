import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../constants/Constants";
import { Ionicons, FontAwesome5 } from "react-native-vector-icons";
import MyTabs from "./TopTab";
import { Caption, Divider, Title } from "react-native-paper";
import { AuthContext } from "../Components/context";
import { LinearGradient } from "expo-linear-gradient";
import TodaysEvents from "./TodaysEvent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../constants/connection";
import { SliderBox } from "react-native-image-slider-box";

function Home({ navigation, ...props }) {
  const { userStatus, userInfoFunction } = React.useContext(AuthContext);

  const profile = () => {
    navigation.navigate("Profile");
  };
 
  let ScreenWidth = Dimensions.get('screen').width;
  let ScreenHeight = Dimensions.get('screen').height;
  let path = "assets/featured(4).jpg";


  const Images = [
    Connection.url+"assets/placetobe.jpg",
    Connection.url+"assets/Streamer.jpg",
    Connection.url+"assets/Green.jpg",
    Connection.url+"assets/Travel.jpg",
  ];
 

  useEffect(() => {
    userInfoFunction();
    return () => {};
  }, []);

  const logged = userStatus.logged;
  return (
    <SafeAreaView style={styles.container}>
      <View
        //to component container
        // profile avatar, App name and serach is included inside the component
        style={styles.headers}
      >
        <View style={styles.brands}>
          <Image
            source={require("../assets/primary.png")}
            resizeMode="cover"
            style={{ width: 152, height: 82 }}
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
            <Ionicons
              name="person"
              size={22}
              style={styles.profileIcon}
              color={Constants.primary}
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
              style={styles.profileIcon}
              color={Constants.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      <Divider style={{ color: Constants.primary }} />

      

      <SliderBox
        images={Images}
        dotColor={Constants.primary}
        inactiveDotColor={Constants.background}
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
        activeOpacity={0.9}
      />
  

      <MyTabs />
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
});

export default Home;
