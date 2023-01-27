import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  ScrollView,
  ToastAndroid,
  Image,
  Pressable,
  TouchableNativeFeedback,
  ActivityIndicator,
} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "../constants/Constants";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "react-native-vector-icons";
import { AuthContext } from "../Components/context";
import { Avatar, Badge, Caption, Paragraph, Title } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import InteractionInfo from "../Components/InteractionInfo";
import Connection from "../constants/connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import BottomSheet from "react-native-simple-bottom-sheet";
import * as Animatable from "react-native-animatable";
import * as Linking from "expo-linking";

function Profile({ navigation, props }) {
  const [load, setLoad] = React.useState(false);
  const { Signout } = React.useContext(AuthContext);

  //bookmarked item count state
  const { items } = useSelector((state) => state.cart);

  /*************************************************** */
  //users meta informations to be displayed in the profile screen
  /************************************************** */

  const [userData, setUserData] = React.useState({
    userId: "",
    userEmail: "",
    userProfile: "",
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });
  //state of user information to be passed to detail screen
  const [detailInfo, setDetailInfo] = useState();
  /************************************************** */
  // count of Event user Posted, count of followers and count of organizer user following
  /************************************************** */
  const [userInfo, setUserInfo] = React.useState({
    eventPosted: "0",
    followers: "0",
    following: "0",
  });
  // state, variable and methods for work with profile picture
  const [hasGalleryPersmission, setHasGalleryPermission] = useState(null);

  // user profile placeholder

  const [image, setImage] = useState(
    Connection.url + Connection.assets + userData.userProfile
  );
  //ask the divice for permission
  if (hasGalleryPersmission === false) {
    return <Text> No access to internal Storage</Text>;
  }
  //Toast message state when user change their profile
  const [profileUpdate, setProfileUpdate] = useState("updated!");
  //toast message for profile update
  const showToast = () => {
    ToastAndroid.show(profileUpdate, ToastAndroid.SHORT);
  };
  //update profile Function
  const updateProfile = (pictureName) => {

    const controller = new AbortController();
    const signal = controller.signal;

    var userIdentity = userData.userId; //variable containing user id
    var profileName = pictureName; //profile name to be stored in the database

    var Url = Connection.url + Connection.updateProfile;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var data = {
      userIdentity: userIdentity,
      profileName: profileName,
    };
    fetch(Url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      signal:signal
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        var responseMessage = response[0].message;

        if (responseMessage === "Updated") {
          setProfileUpdate(responseMessage);
          showToast();
        } else {
          setImage(Connection.url + Connection.assets + userData.userProfile);
          setProfileUpdate(responseMessage);
        }
      });
      return () => {
        // cancel the request before component unmounts
        controller.abort();
    };
  };

  /********************************************* */
  // we select user profile here
  /******************************************* */

  const [updatingProfile, setupdatingProfile] = useState("loaded");

  const selectFeaturedImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    let localUri = result.uri; // local image uri
    let filename = localUri.split("/").pop(); // the filename is stored in filename variable
    if (!result.cancelled) {
      setImage(result.uri);
      setupdatingProfile("loading");
    }

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let kind = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    // all image properties needed by server is going to be appended in formdata object

    formData.append("profile", { uri: localUri, name: filename, type: kind });
    //the url which the image will be sent to
    var ApiUrl = Connection.url + Connection.profile;

    return await fetch(ApiUrl, {
      method: "POST", //request method
      body: formData, // data to be sent to server
      headers: {
        "content-type": "multipart/form-data", // header type must be 'multipart/form-data' inorder to send image to server
      },
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        let message = response[0].message;

        if (message === "successfully uploaded") {
          updateProfile(filename);
          setupdatingProfile(message);
        } else {
          setProfileUpdate("couldn't update profile");
          setupdatingProfile(message);
        }
      })
      .catch((error) => {
        setupdatingProfile("coundn't update");
      });
  };

  // variables and functions for invite friends button inside profile screen
  var msg = "you are invited to install Place to be mobile app  ";
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
    Signout();
    navigation.navigate("TabNav");
  };

  //featch user information from databse
  //fetch event posted by user, followers and following
  // Event count state to b delivered to detail screen
  const [count, setCount] = useState();
  const featchUserInformation = async () => {
    const Controller = new AbortController();
    const Signal = Controller.signal;

    var fetchIt = true;
    var id = await AsyncStorage.getItem("userId");
    var Data = {
      id: id,
    };
    var ApiUrl = Connection.url + Connection.userInfo;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    fetch(ApiUrl, {
      method: "POST",
      body: JSON.stringify(Data),
      headers: headers,
      signal: Signal,
    })
      .then((response) => response.json())
      .then((response) => {
        var serverResponse = response[0].message;
        if (fetchIt) {
          if (serverResponse === "succeed") {
            var eventPostedCount = response[0].events;
            var followerCount = response[0].followers;
            var followingCount = response[0].following;

            setUserInfo({
              ...userInfo,
              eventPosted: eventPostedCount,
              followers: followerCount,
              following: followingCount,
            });
            setCount(eventPostedCount);
            setLoad(true);
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
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        var resp = response[0];

        if (resp.message === "succeed") {
          var userInfo = response[0].user[0];
          setDetailInfo(userInfo);
          setUserData({
            ...userData,
            userId: userInfo.userId,
            userProfile: userInfo.profile,
            userEmail: userInfo.email,
            userName: userInfo.username,
            firstName: userInfo.first_name,
            middleName: userInfo.middle_name,
            lastName: userInfo.last_name,
          });
          setImage(Connection.url + Connection.assets + userInfo.profile);
        } else {
          // console.log(resp.message);
        }
      });

    return () => {
      controller.abort();
    };
  };
  // bottom sheet reference
  const panelRef = useRef(null);

  //check for update button function
  const [buttonShown, setButtonShown] = useState(false);

  const updateButton = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var appVersion = require("../package.json");
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

  return (
    <ScrollView style={styles.container}>
      {load ? (
        <View>
          {buttonShown ? (
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
          ) : null}

          <View style={styles.profileContainer}>
            <LinearGradient
              // Button Linear Gradient
              colors={[Constants.primary, Constants.primary, Constants.primary]}
              style={styles.coverImageContainer}
            ></LinearGradient>

            <TouchableOpacity
              //button which trigger the select Image functionality to chane profile picture
              activeOpacity={0.9}
              onPress={() => selectFeaturedImage()}
              style={styles.profilePicker}
            >
              <Avatar.Image
                source={{ uri: image }}
                size={80}
                style={styles.profileImage}
                onPress={() => selectFeaturedImage()}
              />
              <View style={styles.cameraIcon}>
                {updatingProfile === "loaded" ? (
                  <MaterialCommunityIcons
                    name="camera"
                    size={20}
                    color="#636363"
                  />
                ) : updatingProfile === "loading" ? (
                  <ActivityIndicator size="small" color={Constants.Success} />
                ) : updatingProfile === "successfully uploaded" ? (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={Constants.Success}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="information"
                    size={20}
                    color={Constants.Danger}
                  />
                )}
              </View>
            </TouchableOpacity>

            <View
              //username and user email address container
              style={styles.txtContent}
            >
              <View style={{ alignSelf: "center", alignItems: "center" }}>
                <Title>{userData.userName}</Title>
                <Paragraph>{userData.userEmail}</Paragraph>
              </View>
              <InteractionInfo
                Events={userInfo.eventPosted}
                getData={() => navigation.navigate("yourEvents")}
                followerCountPressed={() => navigation.navigate("Followers")}
                followingCountPressed={() => navigation.navigate("Following")}
                Followers={userInfo.followers}
                Following={userInfo.following}
              />
            </View>
          </View>

          <View style={styles.setContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("My Tickets")}
              style={styles.Settings} //share app with your friends
            >
              <View style={styles.iconbackground}>
                <MaterialCommunityIcons
                  name="ticket"
                  size={20}
                  style={styles.optionIcon}
                />
              </View>
              <Text style={styles.settingtxt}>My Tickets</Text>

              <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  style={[styles.rightarrow,{position:"absolute", right:10}]}
                  
                />
            </TouchableOpacity>

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
                  style={styles.optionIcon}
                />
              </View>
              <Text style={styles.settingtxt}>Account Settings</Text>
              <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  style={[styles.rightarrow,{position:"absolute", right:10}]}
                  
                />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.bookmark}
              onPress={() => navigation.navigate("Bookmarks")}
            >
              <View style={styles.iconbackground}>
                <Ionicons name="bookmark" size={20} style={styles.optionIcon} />
              </View>
              <Text style={styles.settingtxt}>Bookmarks</Text>
              {items.length !== 0 ? (
                <Badge style={styles.badgeStyle}>{items.length}</Badge>
              ) : null}
               <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  style={[styles.rightarrow,{position:"absolute", right:10}]}
                  
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
                  style={styles.optionIcon}
                />
              </View>
              <Text style={styles.settingtxt}>Invite Friends</Text>
              <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  style={[styles.rightarrow,{position:"absolute", right:10}]}
                  
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
                  style={styles.optionIcon}
                />
              </View>
              <Text style={styles.settingtxt}>Privacy Policy</Text>
              <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  style={[styles.rightarrow,{position:"absolute", right:10}]}
                  
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
                  style={styles.optionIcon}
                />
              </View>
              <Text style={styles.settingtxt}>Ask Question</Text>
              <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  style={[styles.rightarrow,{position:"absolute", right:10}]}
                  
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
                  size={25}
                  style={styles.optionIcon}
                />
              </View>
              <Text style={styles.settingtxt}>About</Text>
              <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  style={[styles.rightarrow,{position:"absolute", right:10}]}
                  
                />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.logoutbtn}
              onPress={() => panelRef.current.togglePanel()}
            >
              <View style={styles.iconbackground}>
                <Ionicons name="log-out" size={20} style={styles.optionIcon} />
              </View>
              <Text style={styles.settingtxt}>Log-out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.versioning}>
            <Caption> Version 1.0.0</Caption>
          </View>
        </View>
      ) : (
        <SkeletonPlaceholder>
          <View style={{ height: 270 }}>
            <View style={{ width: "100%", height: 130, borderRadius: 5 }} />

            <View
              style={[
                styles.profilePicker,
                { backgroundColor: Constants.Faded },
              ]}
            />
            <View
              style={[styles.userNameShimmer, { width: 180, borderRadius: 3 }]}
            />
            <View
              style={[styles.userEmailshimmer, { width: 250, borderRadius: 3 }]}
            />
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: -17,
            }}
          >
            <View style={{ width: 110, height: 50, borderRadius: 5 }} />
            <View style={{ width: 110, height: 50, borderRadius: 5 }} />
            <View style={{ width: 110, height: 50, borderRadius: 5 }} />
          </View>
          <View style={{ width: "100%", marginLeft: 13, marginVertical: 15 }}>
            <View
              style={{
                marginLeft: 3,
                marginTop: 16,
                width: "92%",
                height: 30,
                borderRadius: 3,
              }}
            />
            <View
              style={{
                marginLeft: 3,
                marginTop: 16,
                width: "92%",
                height: 30,
                borderRadius: 3,
              }}
            />
            <View
              style={{
                marginLeft: 3,
                marginTop: 16,
                width: "92%",
                height: 30,
                borderRadius: 3,
              }}
            />
            <View
              style={{
                marginLeft: 3,
                marginTop: 16,
                width: "92%",
                height: 30,
                borderRadius: 3,
              }}
            />
            <View
              style={{
                marginLeft: 3,
                marginTop: 16,
                width: "92%",
                height: 30,
                borderRadius: 3,
              }}
            />
            <View
              style={{
                marginLeft: 3,
                marginTop: 16,
                width: "92%",
                height: 30,
                borderRadius: 3,
              }}
            />
            <View
              style={{
                marginLeft: 3,
                marginTop: 16,
                width: "32%",
                height: 30,
                borderRadius: 3,
              }}
            />
          </View>
        </SkeletonPlaceholder>
      )}

      <BottomSheet
        sliderMinHeight={0}
        ref={(ref) => (panelRef.current = ref)}
        isOpen={false}
        innerContentStyle={styles.bottomsheetstyle}
      >
        <Text style={styles.sheetTitle}>You are logging Out!</Text>
        <Caption>Are you sure?</Caption>

        <View style={styles.actionBtn}>
          <Pressable
            style={styles.Cancelbtn}
            onPress={() => panelRef.current.togglePanel()}
          >
            <Text>Cancel</Text>
          </Pressable>

          <Pressable style={styles.YesBtn} onPress={() => userLoggedOut()}>
            <Text>Yes</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Faded,
  },
  setContainer: {
    flex: 2,
    marginTop: -30,
  },
  iconbackground: {
    justifyContent: "center",
    alignItems: "center",
  //  backgroundColor: Constants.Faded,
    padding: 8,
    borderRadius: 10,

    marginLeft: 5,
  },
  Settings: {
    flexDirection: "row",
    alignItems: "center",
    margin: 3,
    marginHorizontal: 16,
    backgroundColor: Constants.background,
    borderRadius: 8,
    paddingVertical:6
  },
  rightarrow:{
color: Constants.Secondary,
  },
  optionIcon: {
    color: Constants.primary,
  },
  bookmark: {
    flexDirection: "row",
    alignItems: "center",
    margin: 1,
    marginHorizontal: 16,
    backgroundColor: Constants.background,
    borderRadius: 8,
    paddingVertical:6
  },
  settingtxt: {
    justifyContent: "center",
    fontSize: Constants.headingtwo,
    marginLeft: 15,
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
  },
  horizontalline: {
    backgroundColor: Constants.background,
    height: 1,
    margin: 10,
  },
  backArrow: {
    position: "absolute",
    top: 4,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 38,
    marginBottom: 8,
    backgroundColor: Constants.background,
    borderRadius: 50,
    elevation: 1,
    padding: 6,
  },
  profileContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: Constants.Faded,
    justifyContent: "center",
    width: "100%",
    height: 320,
  },
  coverImageContainer: {
    width: "100%",
    height: 110,
    backgroundColor: Constants.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 2,
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
    top: -45,
    backgroundColor: Constants.Faded,
    width: 88,
    height: 88,
    alignSelf: "center",
    borderRadius: 43,
    padding: 3.8,
    elevation: 2,
    shadowColor: Constants.Secondary,
  },
  txtContent: {
    top: -55,
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
  userNameShimmer: {
    top: -48,
    margin: 15,
    padding: 10,
    alignSelf: "center",
  },
  userEmailshimmer: {
    top: -68,
    margin: 15,
    padding: 8,
    alignSelf: "center",
  },
  logoutbtn: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    marginLeft: 22,
    marginBottom: 70,
    // backgroundColor: Constants.primary
  },

  bottomsheetstyle: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  sheetTitle: {
    color: Constants.Inverse,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
  },
  actionBtn: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 40,
  },
  Cancelbtn: {
    backgroundColor: Constants.Faded,
    padding: 6,
    paddingHorizontal: 20,
    borderRadius: Constants.tiny,
  },
  YesBtn: {
    width: "40%",
    backgroundColor: Constants.primary,
    padding: 6,
    paddingHorizontal: 20,
    borderRadius: Constants.tiny,
    alignItems: "center",
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
    marginTop: -20,
    marginBottom: 30,
    marginLeft: 28,
  },
});

export default Profile;
