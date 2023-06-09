import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { Title, HelperText } from "react-native-paper";
import { AuthContext } from "../../Components/context";
import Notice from "../../Components/Notifications/Notice";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";
import NotLoggedIn from "../../handlers/auth";
import NoConnection from "../../handlers/connection";
import NoticeShimmer from "../../Components/Notifications/Skeleton/NoticeShimmer";
import Slider from "../../Components/Slider";
const Notifications = ({ navigation }) => {
  // state from context from Context Hook
  const { userStatus } = useContext(AuthContext);
  const logged = userStatus.logged;

  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [notification, setNotification] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // refresh the list of notifications
  const RefreshList = async () => {
    let id = await AsyncStorage.getItem("userId");
    setRefreshing(true);
    setLoading(true);
    let isApiSubscribed = true;
    var ApiUrl = Connection.url + Connection.notification;

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
          const filter = (data) => {
            return data !== null;
          };
          if (message === "succeed") {
            var result = response[0].Notification;
            var notice = result.filter(filter);
            var sorted = notice.sort(notice.event_id);
            setNotification(sorted);
            setRefreshing(false);
            setLoading(false);
          } else if (message === "no event") {
            setNotification([]);
            setRefreshing(false);
            setLoading(false);
          } else if ((message = "follow organizers")) {
            setNotification(notice);
            setRefreshing(false);
            setLoading(false);
          } else {
            setNotification(notification);
            setLoading(false);
            setRefreshing(false);
          }
        }
      })
      .catch(() => {
        setLoading(false);
        setRefreshing(false);
      });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  };

  // render flatlist item
  const renderNotice = ({ item }) => (
    <Notice
      Event_Id={item.event_id}
      organizerName={item.event_organizer}
      noticeTitle={item.event_name}
      date={item.addedDate}
      onPressNotice={() =>
        navigation.navigate("EventDetail", { id: item.event_id })
      }
    />
  );
  useEffect(() => {
    const InternetConnection = async () => {
      const networkState = await NetInfo.fetch();
      setConnection(networkState.isConnected);
    };
    InternetConnection();

    const subscription = NetInfo.addEventListener(async (state) => {
      setConnection(state.isConnected);
    });
    return () => {
      subscription();
    };
  }, [retry]);

  //handle the work to be done when network is available
  useEffect(() => {
    if (connection) {
      RefreshList();
    }

    return () => {};
  }, [connection]);

  return (
    <View>
      {logged ? (
        connection ? (
          loading ? (
            <View>
              <View>
                <NoticeShimmer />
                <NoticeShimmer />
                <NoticeShimmer />
                <NoticeShimmer />
                <NoticeShimmer />
              </View>

              <View>
                <NoticeShimmer />
                <NoticeShimmer />
                <NoticeShimmer />
                <NoticeShimmer />
              </View>
            </View>
          ) : (
            <FlatList
              data={notification}
              renderItem={renderNotice}
              keyExtractor={(item) => item.event_id}
              onRefresh={RefreshList}
              refreshing={refreshing}
              ListEmptyComponent={
                <View style={styles.noNoticeContainer}>
                  <Image
                    source={require("../../assets/images/noNotification.png")}
                    style={styles.noNoticeImage}
                    resizeMode="contain"
                  />
                  <Text>You have no notification yet!</Text>
                </View>
              }
              ListHeaderComponent={<Slider />}
              ListFooterComponent={() => (
                <View style={styles.listEnd}>
                  <HelperText>
                    Notifications from organizers you followed.
                  </HelperText>
                </View>
              )}
            />
          )
        ) : (
          <View style={{ height: Dimensions.get("screen").height / 1.2 }}>
            <NoConnection onPress={() => setRetry(!retry)} />
          </View>
        )
      ) : (
        <NotLoggedIn
          helpertext="You should have to login first to view your tickets"
          signUp={() => navigation.navigate("SignUp")}
          signIn={() => navigation.navigate("SignIn")}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  noNoticeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
    height: Dimensions.get("screen").height / 1.5,
  },
  noNoticeImage: {
    width: "85%",
    height: 200,
    borderRadius: Constants.mediumbox,
  },
  prompttxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,

    alignSelf: "center",
    justifyContent: "center",
  },
  listEnd: {
    padding: 20,
    backgroundColor: Constants.transparentPrimary,
    marginTop: 5,
    margin: 5,
    borderRadius: Constants.tinybox,
    marginBottom: 62,
  },
});

export default Notifications;
