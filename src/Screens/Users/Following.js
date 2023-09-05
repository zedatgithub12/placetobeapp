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
import Loader from "../../ui-components/ActivityIndicator";

// create a component
const Following = ({ navigation }) => {
  // state of followers
  // state is updated by the array retived from server on component mount

  const [followers, setFollowers] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [count, setCount] = useState(0);
  const [followStatus, setFollowStatus] = useState("Following");
  const [loading, setLoading] = useState(true);

  const featchFollowers = async () => {
    const Controller = new AbortController();
    const signal = Controller.signal;

    setLoading(true);
    setRefreshing(true);

    var userId = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.following + userId;

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
          var followingArray = response.data;
          setCount(followingArray.length);
          setFollowers(followingArray);
          setLoading(false);
          setRefreshing(false);
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
  const OrganizerDetail = async (organizerInfo) => {
    navigation.navigate("Organizer Detail", {
      organizerInfo,
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
      {loading ? (
        <Loader size="small" />
      ) : (
        <>
          <View style={styles.topContent}>
            <Text style={styles.followersCount}>{count}</Text>
            <Text style={styles.allfollowers}>Following</Text>
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
                  source={require("../../assets/images/followings.png")}
                  resizeMode="contain"
                  style={styles.notFound}
                />
                <Text style={styles.emptyMessageStyle}>No Followings!</Text>
                <HelperText style={{ alignSelf: "center" }}>
                  Follow some organizer to stay updated
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
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  emptyMessageStyle: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,

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
