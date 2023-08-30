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
import { useTheme } from "@react-navigation/native";
import NotificationSkeleton from "./skeleton";
import P2bModal from "../../ui-components/p2bmodal";

const Notifications = ({ navigation }) => {
  const { userStatus } = useContext(AuthContext);
  const logged = userStatus.logged;

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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Fetch & render notification when component get mounted
  const FetchNotifications = async () => {
    let id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.notification + id;

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
          setLoading(false);
        } else {
          setNotification([]);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  };

  // refresh the list of notifications
  const RefreshList = async () => {
    let id = await AsyncStorage.getItem("userId");
    setRefreshing(true);
    setLoading(true);
    var ApiUrl = Connection.url + Connection.notification + id;

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
    const createdDate = new Date(time);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedTimestamp = createdDate.toLocaleString("en-US", options);
    return formattedTimestamp;
  };

  // render flatlist item
  const renderNotice = ({ item }) => (
    <Notice
      noticeTitle={item.notification_title}
      about={item.notification_content}
      date={item.created_at}
      time={Timestamp(item.created_at)}
      onPressNotice={() => OpenNotification(item)}
    />
  );

  const OpenNotification = (item) => {
    if (item.notification_content_type === "event") {
      navigation.navigate("EventDetail", { id: item.id });
    } else {
      OpenBottomSheet(item);
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
      style={[styles.container, { backgroundColor: theme.background.darker }]}
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
          helpertext="You should have to login first to view your tickets"
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
    alignSelf: "center",
    textAlign: "justify",
    paddingHorizontal: 6,
    lineHeight: 22,
  },
});

export default Notifications;
