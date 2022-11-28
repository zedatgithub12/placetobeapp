//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { HelperText } from "react-native-paper";
import Listing from "../Components/userList";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";

// create a component
const Following = ({ navigation }) => {
  // state of followers
  // state is updated by the array retived from server on component mount
  const [notFound, setNotFound] = useState(false);
  const [followers, setFollowers] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [count, setCount] = useState(0);
  const [followStatus, setFollowStatus] = useState("Following");
  const [loading, setLoading] = useState(false);

  const featchFollowers = async () => {
    
    setRefreshing(true);
    var userId = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.following;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var Data = {
      userId: userId,
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;
        if (message === "succeed") {
          var followingArray = response[0].following;
          setCount(followingArray.length);
          setFollowers(followingArray);
         
          setNotFound(false);
          setRefreshing(false);
        } else {
          
          setNotFound(true);
          setRefreshing(false);
        }
      })
      .catch((error) => {
        setRefreshing(false);
      });
  };

  //status user weather user is following  or not
  const OrganizerDetail = async (organizerInfo) => {
    var followerId = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.organizer;
    //organizer id is the only data to be sent to server in order to retrive organizer data
    var userId = organizerInfo.userId;
    var Data = {
      userId: userId,
      followerId: followerId,
    };
    // header type for text data to be send to server
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((response) => {
        // let message = response[0].message;
        let follow = response[0].follow;
        setFollowStatus(follow);
      });

    navigation.navigate("Organizer Detail", {
      organizerInfo,
      followStatus,
    });
  };

  const renderItem = ({ item }) => (
    <Listing
      image={item.profile}
      username={item.username}
      category={item.category}
      onPressProfile={() => OrganizerDetail(item)}
    />
  );

  useEffect(() => {
    featchFollowers();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      
          <View style={styles.topContent}>
            <Text style={styles.followersCount}>{count}</Text>
            <Text style={styles.allfollowers}>Following</Text>
          </View>

          <FlatList
            data={followers}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId}
            onRefresh={featchFollowers}
            refreshing={refreshing}
            ListHeaderComponent={() =>
              notFound ? (
                <View style={styles.noContainer}>
                  <Image
                    source={require("../assets/followers.png")}
                    resizeMode="contain"
                    style={styles.notFound}
                  />
                  <Text style={styles.emptyMessageStyle}>
                    0 Following!
                  </Text>
                  <HelperText style={{ alignSelf: "center" }}>
                    You have no following yet!
                  </HelperText>
                </View>
              ) : null
            }
          />
       
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
  },
  noContainer:{
    flex: 1,
    backgroundColor: Constants.background,
    alignItems:"center",
  },
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 23,
    marginVertical: 16,
  },
  allfollowers: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.purple,
    marginLeft: 5,
  },
  followersCount: {
    fontSize: Constants.headingthree,
    fontFamily: Constants.fontFam,
    color: "#fff",
    backgroundColor: Constants.purple,
    paddingHorizontal: 8,
    padding: 2,
    borderRadius: Constants.medium,
  },
  notFound: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  emptyMessageStyle: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.Secondary,

    alignSelf: "center",
    justifyContent: "center",
  },
  title: {
    width: "35%",
    height: 20,
    borderRadius: 3,
    marginTop: 17,
    marginHorizontal: 27,
  },
});

//make this component available to the app
export default Following;
