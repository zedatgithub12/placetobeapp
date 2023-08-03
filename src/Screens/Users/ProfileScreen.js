import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  ScrollView,
  ToastAndroid,
  Alert,
  Pressable,
  TouchableNativeFeedback,
  ActivityIndicator,
} from "react-native";

import Constants from "../../constants/Constants";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "react-native-vector-icons";
import { AuthContext } from "../../Components/context";
import { Avatar, Caption, Divider, Paragraph, Title } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import Connection from "../../constants/connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from "react-native-simple-bottom-sheet";
import * as Animatable from "react-native-animatable";
import * as Linking from "expo-linking";
import p2bavatar from "../../assets/images/p2bavatar.png";
import ProfileShimmer from "./Skeletons/profilepage";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../themes/typography";
import LogoutDialog from "./components/logout";

function Profile({ navigation, props }) {
  const { theme } = useTheme();
  const [load, setLoad] = React.useState(true);
  const { Signout } = React.useContext(AuthContext);

  const [detailInfo, setDetailInfo] = useState();
  const [hasGalleryPersmission, setHasGalleryPermission] = useState(null);
  const [updatingProfile, setupdatingProfile] = useState("camera");
  const [buttonShown, setButtonShown] = useState(false);
  const [count, setCount] = useState(0);

  const [userInfo, setUserInfo] = React.useState({
    eventPosted: "0",
    followers: "0",
    following: "0",
  });
  const [userData, setUserData] = React.useState({
    userId: "",
    userEmail: "",
    userProfile: "",
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  const [image, setImage] = useState(
    Connection.url + Connection.assets + userData.userProfile
  );
  //toast message for profile update
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  /********************************************* */
  // we select user profile here
  /******************************************* */

  const selectFeaturedImage = async () => {
    //ask the divice for permission
    if (hasGalleryPersmission === false) {
      return <Text> No access to internal Storage</Text>;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled && result.uri) {
        setImage(result.uri);
        uploadImage(result.uri);
      } else {
        console.log("Error: No image selected");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const uploadImage = async (image) => {
    var userId = await AsyncStorage.getItem("userId");
    const Api = Connection.url + Connection.changeprofile + userId;

    const imageuri =
      Platform.OS === "android" ? image : image.replace("file://", "");

    const manipResult = await ImageManipulator.manipulateAsync(
      imageuri,
      [{ resize: { width: 800, height: 800 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    const uri = manipResult.uri;
    const fileType = uri.substring(uri.lastIndexOf(".") + 1);

    const checkFileSize = async (fileURI) => {
      const fileInfo = await FileSystem.getInfoAsync(fileURI);
      if (!fileInfo.size) return false;
      const sizeInMb = fileInfo.size / 1024 / 1024;
      return sizeInMb.toFixed(2);
    };

    const size = await checkFileSize(uri);

    const formData = new FormData();
    formData.append("profile", {
      uri: uri,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    });

    if (size > 10.0) {
      showToast("Max image size is reached!");
      setupdatingProfile("camera");
      setImage(Connection.url + Connection.assets + userData.userProfile);
    } else {
      setupdatingProfile("loading");
      fetch(Api, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            setupdatingProfile("done");
            showToast("Profile Updated!");
          } else {
            setupdatingProfile("camera");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          console.error("Error:", error.stack);
          setupdatingProfile("camera");
        });
    }
  };

  // variables and functions for invite friends button inside profile screen
  var msg = "You are invited to install Place to be mobile app  ";
  var links = Constants.appLink;
  // share the app to friends
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: msg + links,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // when logout button pressed this function is called
  const userLoggedOut = async () => {
    await Signout();
    navigation.navigate("TabNav");
  };

  //featch user information from databse
  //fetch event posted by user, followers and following
  // Event count state to b delivered to detail screen

  const featchUserInformation = async () => {
    const Controller = new AbortController();
    const Signal = Controller.signal;

    var fetchIt = true;
    var id = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.userInfo + id;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
      signal: Signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (fetchIt) {
          if (response.success) {
            var eventPostedCount = response.events;
            var followerCount = response.followers;
            var followingCount = response.following;

            setUserInfo({
              ...userInfo,
              eventPosted: eventPostedCount,
              followers: followerCount,
              following: followingCount,
            });
            setCount(eventPostedCount);
            setLoad(false);
          } else {
            setLoad(false);
          }
        }
      })
      .catch((err) => {
        setLoad(false);
      });
    return () => {
      fetchIt = false;
      Controller.abort();
    };
  };

  /****************************************************** */
  // we get user information from database
  /****************************************************** */
  const getUserInfo = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var userId = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.MetaData + userId;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    //save user info into database
    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          var userInfo = response.data;
          setDetailInfo(userInfo);
          setUserData({
            ...userData,
            userId: userInfo.id,
            userProfile: userInfo.profile,
            userEmail: userInfo.email,
            userName: userInfo.username,
            firstName: userInfo.first_name,
            middleName: userInfo.middle_name,
            lastName: userInfo.last_name,
          });
          setImage(Connection.url + Connection.assets + userInfo.profile);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      controller.abort();
    };
  };
  // bottom sheet reference
  const panelRef = useRef(null);

  const updateButton = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var appVersion = require("../../../package.json");
    var localAppVersion = appVersion.version;

    var ApiUrl = Connection.url + Connection.appInfo;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;

        if (message === "succeed") {
          var databaseAppVersion = response[0].version.version;

          if (databaseAppVersion > localAppVersion) {
            setButtonShown(true);
          } else {
            setButtonShown(false);
          }
        } else if (message === "not featched") {
          setButtonShown(false);
        } else {
          setButtonShown(false);
        }
      })
      .catch((error) => {
        setButtonShown(false);
      });
    return () => {
      // cancel the request before component unmounts
      controller.abort();
    };
  };

  // useffect perform componentdidmount and componentwillUnmounted function here
  useEffect(() => {
    let isApiSubscribed = true;

    if (isApiSubscribed) {
      getUserInfo();
      featchUserInformation();
      (async () => {
        const gallerStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(gallerStatus.status === "granted");
      })();

      updateButton();
    }
    return () => {
      isApiSubscribed = false;
    };
  }, []);

  const [dialogVisible, setDialogVisible] = useState(false);

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const handleLogout = () => {
    setDialogVisible(false);
    userLoggedOut();
  };

  // loggout function
  const Logout = () =>
    Alert.alert(
      "Are you sure you want to logout?",
      "This action will log you out of the application.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => userLoggedOut(),
          style: "destructive",
        },
      ]
    );
  return (
    <ScrollView style={{ backgroundColor: theme.background.darker }}>
      {load ? (
        <ProfileShimmer />
      ) : (
        <View>
          <View
            style={[
              styles.profileContainer,
              { backgroundColor: theme.primary.main },
            ]}
          >
            <TouchableOpacity
              //button which trigger the select Image functionality to chane profile picture
              activeOpacity={0.9}
              onPress={selectFeaturedImage}
              style={styles.profilePicker}
            >
              <Avatar.Image
                source={image ? { uri: image } : p2bavatar}
                size={80}
                style={styles.profileImage}
                onPress={selectFeaturedImage}
              />
              <View style={styles.cameraIcon}>
                {updatingProfile === "camera" ? (
                  <MaterialCommunityIcons
                    name="camera"
                    size={18}
                    color={theme.dark[400]}
                  />
                ) : updatingProfile === "loading" ? (
                  <ActivityIndicator size="small" color={Constants.Success} />
                ) : updatingProfile === "done" ? (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color={Constants.Success}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="information"
                    size={18}
                    color={Constants.Danger}
                  />
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.txtContent}>
              <View style={{ alignSelf: "center", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: Typography.family,
                    fontSize: Typography.size.headingone,
                    fontWeight: Typography.weight.bold,
                    paddingHorizontal: 6,
                  }}
                >
                  {userData.userName}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("Following")}
                activeOpacity={0.9}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 4,
                  padding: 3,
                  paddingTop: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: Typography.family,
                    fontSize: Typography.size.headingtwo,
                    fontWeight: Typography.weight.bold,
                    paddingHorizontal: 6,
                  }}
                >
                  {userInfo.following}
                </Text>
                <Text
                  style={{
                    fontFamily: Typography.family,
                    fontSize: Typography.size.headingtwo,
                    fontWeight: Typography.weight.medium,
                  }}
                >
                  Following
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.setContainer,
              { backgroundColor: theme.background.darker },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.Settings}
              onPress={() =>
                navigation.navigate("Account Settings", { detailInfo })
              }
            >
              <View style={styles.iconbackground}>
                <MaterialCommunityIcons
                  name="account-cog"
                  size={22}
                  style={{ color: theme.dark[600] }}
                />
              </View>
              <Text style={styles.settingtxt}>Account Settings</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                style={[styles.rightarrow, { position: "absolute", right: 10 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onShare}
              style={styles.Settings} //share app with your friends
            >
              <View style={styles.iconbackground}>
                <Ionicons
                  name="share-social-sharp"
                  size={20}
                  style={{ color: theme.dark[600] }}
                />
              </View>
              <Text style={styles.settingtxt}>Invite Friends</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                style={[styles.rightarrow, { position: "absolute", right: 10 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.Settings}
              onPress={() =>
                Linking.openURL(
                  "https://www.p2b-ethiopia.com/privacy-policy-2/"
                )
              }
            >
              <View style={styles.iconbackground}>
                <MaterialCommunityIcons
                  name="security"
                  size={23}
                  style={{ color: theme.dark[600] }}
                />
              </View>
              <Text style={styles.settingtxt}>Privacy Policy</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                style={[styles.rightarrow, { position: "absolute", right: 10 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.Settings}
              onPress={() => navigation.navigate("Questions")}
            >
              <View style={styles.iconbackground}>
                <MaterialCommunityIcons
                  name="message-question"
                  size={20}
                  style={{ color: theme.dark[600] }}
                />
              </View>
              <Text style={styles.settingtxt}>Ask Question</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                style={[styles.rightarrow, { position: "absolute", right: 10 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.Settings}
              onPress={() => navigation.navigate("About")}
            >
              <View style={styles.iconbackground}>
                <MaterialCommunityIcons
                  name="information"
                  size={24}
                  style={{ color: theme.dark[600] }}
                />
              </View>
              <Text style={styles.settingtxt}>About us</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                style={[styles.rightarrow, { position: "absolute", right: 10 }]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.logoutbtn}
              onPress={() => setDialogVisible(true)}
            >
              <View style={styles.iconbackground}>
                <Ionicons
                  name="log-out"
                  size={24}
                  style={{ color: theme.dark[600] }}
                />
              </View>
              <Text style={styles.settingtxt}>Log-out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.versioning}>
            <Caption> Version 1.0.1</Caption>
          </View>
          {buttonShown && (
            <TouchableNativeFeedback
              onPress={() => Linking.openURL(Constants.appLink)}
              style={{ alignItems: "center" }}
            >
              <Animatable.View
                animation="slideInRight"
                style={styles.updateButton}
              >
                <MaterialCommunityIcons
                  name="arrow-up-bold-circle"
                  size={20}
                  style={styles.updateIcon}
                />
                <Text style={styles.updateText}>Update Available</Text>
              </Animatable.View>
            </TouchableNativeFeedback>
          )}
        </View>
      )}
      <LogoutDialog
        visible={dialogVisible}
        onCancel={handleCancel}
        onLogout={handleLogout}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  setContainer: {
    flex: 2,
    margin: 12,
    marginHorizontal: 0,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: Constants.Faded,
  },
  iconbackground: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    marginLeft: 5,
  },
  Settings: {
    flexDirection: "row",
    alignItems: "center",
    margin: 3,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 6,
  },
  rightarrow: {
    color: Constants.Secondary,
  },

  settingtxt: {
    justifyContent: "center",
    fontSize: Constants.headingthree,
    marginLeft: 15,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
  },
  horizontalline: {
    backgroundColor: Constants.background,
    height: 1,
    margin: 10,
  },

  profileContainer: {
    position: "relative",
    justifyContent: "center",
    width: "100%",
    paddingTop: 24,
  },
  coverImageContainer: {
    width: "100%",
    backgroundColor: Constants.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 3,
    right: 0,
    backgroundColor: Constants.background,
    padding: 6,
    borderRadius: 50,
    elevation: 3,
  },
  coverTxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
  },

  profilePicker: {
    backgroundColor: Constants.Faded,
    width: 88,
    height: 88,
    alignSelf: "center",
    borderRadius: 44,
    padding: 3.8,
    elevation: 2,
    shadowColor: Constants.Secondary,
  },
  txtContent: {
    marginTop: 5,
    margin: 4,
    padding: 5,
  },
  profileImage: {
    backgroundColor: Constants.Faded,
  },
  badgeStyle: {
    alignSelf: "center",
    color: Constants.background,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
    marginLeft: 15,
  },

  logoutbtn: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    marginLeft: 18,
    // backgroundColor: Constants.primary
  },

  updateButton: {
    position: "absolute",
    bottom: 10,
    zIndex: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    backgroundColor: Constants.Success,
    paddingVertical: 7,
    borderRadius: Constants.tiny,
  },
  updateIcon: {
    color: Constants.Inverse,
  },
  updateText: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Faded,
    marginLeft: 6,
  },
  versioning: {
    marginTop: 12,
    marginBottom: 30,
    marginLeft: 28,
  },
});

export default Profile;
