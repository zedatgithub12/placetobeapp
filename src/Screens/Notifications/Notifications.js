import React, { useState, useContext, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { AuthContext } from "../../Components/context";
import { useTheme } from "@react-navigation/native";
import Notice from "../../Components/Notifications/Notice";
import Constants from "../../constants/Constants";
import NotLoggedIn from "../../handlers/auth";
import NoConnection from "../../handlers/connection";
import NotificationSkeleton from "./skeleton";
import P2bModal from "../../ui-components/p2bmodal";
import moment from "moment";
import Connection from "../../api";
import { useDispatch } from "react-redux";
import {
  incrementNotificationCount,
  decrementNotificationCount,
} from "../../Reducer/NotificationCount";

const Notifications = ({ navigation }) => {
  const { userStatus } = useContext(AuthContext);
  const logged = userStatus.logged;

  const dispatch = useDispatch();

  const { theme } = useTheme();
  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [notification, setNotification] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [textContent, setTextContent] = useState({
    title: "",
    description: "",
  });

  const handleNewNotification = async () => {
    const unseen = notification.filter((notice) => notice.status == null);
    const counts = unseen.length;
    dispatch(incrementNotificationCount(counts));
  };

  const NewNotificationCount = async (data) => {
    const unseen = data.filter((notice) => notice.status === null);
    const counts = unseen.length;
    logged && dispatch(incrementNotificationCount(counts));
  };

  // Fetch & render notification when component get mounted
  const FetchNotifications = async () => {
    let id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.getNotification + id;

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setNotification(response.data);
          NewNotificationCount(response.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // refresh the list of notifications
  const RefreshList = async () => {
    let id = await AsyncStorage.getItem("userId");
    setRefreshing(true);
    setLoading(true);
    var ApiUrl = Connection.url + Connection.getNotification + id;

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        if (response.success) {
          setNotification(response.data);
          handleNewNotification();
          setRefreshing(false);
          setLoading(false);
        } else {
          setLoading(false);
          setRefreshing(false);
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

  //render notification timestamp
  const Timestamp = (time) => {
    const createdDate = moment(time);
    const currentDate = moment();
    const duration = moment.duration(currentDate.diff(createdDate));

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let timeSince = "";

    if (days > 0) {
      timeSince += `${days} day${days > 1 ? "s" : ""} `;
    } else if (days > 7) {
      timeSince += `${days / 4} week${days > 1 ? "s" : ""} `;
    } else if (days > 30) {
      timeSince += `${days / 30} month${days > 1 ? "s" : ""} `;
    } else if (days > 365) {
      timeSince += `${days / 365} year${days > 1 ? "s" : ""} `;
    } else if (hours > 0) {
      timeSince += `${hours} hour${hours > 1 ? "s" : ""} `;
    } else if (minutes > 0) {
      timeSince += `${minutes} minute${minutes > 1 ? "s" : ""} `;
    }

    if (timeSince === "") {
      timeSince = "Just now";
    } else {
      timeSince += "ago";
    }

    return timeSince;
  };

  const NotificationIconColor = (type) => {
    var Color;

    switch (type) {
      case "event":
        Color = theme.success.main;
        break;

      case "alert":
        Color = theme.primary.main;

        break;

      default:
        Color = "#ffbb00";
    }
    return Color;
  };

  // render flatlist item
  const renderNotice = ({ item }) => (
    <Notice
      key={item.id}
      type={item.notification_content_type}
      iconColor={NotificationIconColor(item.notification_content_type)}
      noticeTitle={item.notification_title}
      about={item.notification_content}
      date={item.created_at}
      time={Timestamp(item.created_at)}
      status={item.status}
      onPressNotice={() => OpenNotification(item)}
    />
  );

  const SeenNotification = async (notification) => {
    const controller = new AbortController();
    const signal = controller.signal;
    let id = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.notified;

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var data = {
      notification_id: notification.id,
      user_id: id,
      status: "seen",
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      signal: signal,
    });

    return () => {
      controller.abort();
    };
  };

  const UpdateNotificationState = (id) => {
    const ItemIndex = notification.findIndex((notice) => notice.id === id);

    if (ItemIndex !== -1) {
      const updatedData = [...notification];
      updatedData[ItemIndex].status = "seen";
      setNotification(updatedData);
    }
  };

  const OpenNotification = async (item) => {
    if (item.status === null) {
      UpdateNotificationState(item.id);
      dispatch(decrementNotificationCount());

      if (item.notification_content_type === "event") {
        await SeenNotification(item);
        navigation.navigate("EventDetail", {
          id: item.notification_content_id,
        });
      } else {
        OpenBottomSheet(item);
        SeenNotification(item);
      }
    } else {
      if (item.notification_content_type === "event") {
        navigation.navigate("EventDetail", {
          id: item.notification_content_id,
        });
      } else {
        OpenBottomSheet(item);
      }
    }
  };

  const OpenBottomSheet = (item) => {
    setTextContent({
      ...textContent,
      title: item.notification_title,
      description: item.notification_content,
    });
    setIsModalVisible(true);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

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
      FetchNotifications();
    }
    return () => {};
  }, [connection]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background.darker,
          paddingBottom: logged ? 50 : 0,
        },
      ]}
    >
      {logged ? (
        connection ? (
          loading ? (
            <NotificationSkeleton />
          ) : (
            <FlatList
              data={notification}
              renderItem={renderNotice}
              keyExtractor={(item) => item.id}
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
            />
          )
        ) : (
          <View style={{ height: Dimensions.get("screen").height / 1.2 }}>
            <NoConnection onPress={() => setRetry(!retry)} />
          </View>
        )
      ) : (
        <NotLoggedIn
          helpertext="You should have to login first to receive notifications"
          signUp={() => navigation.navigate("SignUp")}
          signIn={() => navigation.navigate("SignIn")}
        />
      )}

      <P2bModal
        visible={isModalVisible}
        toggleModal={() => toggleModal()}
        title={textContent.title}
      >
        <View>
          <Text style={styles.textContents}>{textContent.description}</Text>
        </View>
      </P2bModal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  noNoticeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
    height: Dimensions.get("screen").height / 1.2,
  },
  noNoticeImage: {
    width: "85%",
    height: 230,
    borderRadius: Constants.mediumbox,
  },
  prompttxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
    alignSelf: "center",
    justifyContent: "center",
  },
  textContents: {
    fontSize: Constants.headingthree,
    color: Constants.Inverse,
    textAlign: "justify",
    paddingHorizontal: 6,
    lineHeight: 22,
  },
});

export default Notifications;
