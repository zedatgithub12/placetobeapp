import React, { useEffect, useState } from "react";
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
import { Ionicons } from "react-native-vector-icons";
import MyTabs from "./TopTab";
import { Caption, Divider, Title } from "react-native-paper";
import { AuthContext } from "../Components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Connection from "../constants/connection";
import { SliderBox } from "react-native-image-slider-box";
import Categories from "../Components/CategoryListing";
import Category from "../src/Category";

function Home({ navigation, ...props }) {
  const { userStatus, userInfoFunction } = React.useContext(AuthContext);

  const profile = () => {
    navigation.navigate("Profile");
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

  //scroll View con
  const [shown, setShown] = useState(true);

  useEffect(() => {
    userInfoFunction();
    featchImage();
    userProfile();
    return () => {};
  }, [logged]);

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
            source={require("../assets/header.png")}
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
      <Divider style={{ color: Constants.transparentPrimary }} />

      <View>
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
  categories: {
    paddingHorizontal: 6,
  },
});

export default Home;
