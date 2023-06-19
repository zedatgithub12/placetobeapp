//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { HelperText } from "react-native-paper";
import Listing from "../../Components/userList";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";

const Followers = ({ navigation }) => {
  // state of followers
  // state is updated by the array retived from server on component mount

  const [followers, setFollowers] = useState();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const featchFollowers = async () => {
    const Controller = new AbortController();
    const signal = Controller.signal;
    setRefreshing(true);
    setLoading(true);
    var userId = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.followers + userId;
    var headers = {
      Accept: "application/json",
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
          const followersArray = response.data;
          setCount(followersArray.length);
          setFollowers(followersArray);
          setRefreshing(false);
          setLoading(false);
        } else {
          setRefreshing(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        setRefreshing(false);
        setLoading(false);
      });

    return () => {
      Controller.abort();
    };
  };

  //status user weather user is following  or not
  const featchOrganizer = async (organizerInfo) => {
    navigation.navigate("Organizer Detail", {
      organizerInfo,
    });
  };

  const renderItem = ({ item }) => (
    <Listing
      image={item.profile}
      username={item.username}
      category={item.category}
      onPressProfile={() => featchOrganizer(item)}
    />
  );

  useEffect(() => {
    featchFollowers();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ paddingTop: 20 }}>
          <ActivityIndicator size="large" color={Constants.Inverse} />
        </View>
      ) : (
        <>
          <View style={styles.topContent}>
            <Text style={styles.followersCount}>{count}</Text>
            <Text style={styles.allfollowers}>Followers</Text>
          </View>

          <FlatList
            data={followers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onRefresh={featchFollowers}
            refreshing={refreshing}
            ListEmptyComponent={
              <View style={styles.noContainer}>
                <Image
                  source={require("../../assets/images/followers.png")}
                  resizeMode="contain"
                  style={styles.notFound}
                />
                <Text style={styles.emptyMessageStyle}>No Followers yet!</Text>
                <HelperText style={{ alignSelf: "center" }}>
                  To get notification of event follow some organizer!
                </HelperText>
              </View>
            }
          />
        </>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
  },

  noContainer: {
    flex: 1,
    backgroundColor: Constants.background,
    alignItems: "center",
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
    width: "28%",
    height: 20,
    borderRadius: 3,
    marginTop: 17,
    marginHorizontal: 27,
  },
  counts: {
    width: "15%",
    height: 20,
    borderRadius: 3,
    marginTop: 17,
  },
});

//make this component available to the app
export default Followers;
