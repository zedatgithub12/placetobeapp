import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Share,
  ScrollView,
  Modal,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Constants from "../../constants/Constants";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "react-native-vector-icons";
import Connection from "../../api";
import { AuthContext } from "../../Components/context";
import { Avatar, Caption } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import p2bavatar from "../../assets/images/avatar.png";
import ProfileShimmer from "./Skeletons/profilepage";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../themes/typography";
import LogoutDialog from "./components/logout";
import { showToast } from "../../Utils/Toast";
import NoConnection from "../../handlers/connection";

function Profile({ navigation }) {
  const { theme } = useTheme();

  const { Signout } = useContext(AuthContext);

  const [connection, setConnection] = useState(true);
  const [retry, setRetry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailInfo, setDetailInfo] = useState();
  const [hasGalleryPersmission, setHasGalleryPermission] = useState(null);
  const [updatingProfile, setupdatingProfile] = useState("camera");
  const [image, setImage] = useState(null);
  const [btnstate, setBtnState] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); //show profile modal
  const [userData, setUserData] = useState({
    userId: "",
    userEmail: "",
    userProfile: "",
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    following: "0",
  });

  const Nameformatter = (firstname, fathername) => {
    if (firstname && fathername) {
      return firstname + " " + fathername;
    } else if (firstname && !fathername) {
      return firstname;
    } else {
      var username = "Your Name";
      return username;
    }
  };

  const selectProfileImage = async () => {
    if (btnstate) {
      return; // Ignore double touch
    }
    setBtnState(true);

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

      if (!result.canceled && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }

    setTimeout(() => {
      setBtnState(false);
    }, 2000);
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
      showToast("Exceeded max(10MB) image size!");
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
          setupdatingProfile("camera");
        });
    }
  };

  const onShare = async () => {
    var msg = "You are invited to install Place to be mobile app  ";
    var links = Constants.appLink;
    try {
      const result = await Share.share({
        message: msg + links,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      showToast("Error sharing link");
    }
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const handleLogout = () => {
    userLoggedOut();
    setDialogVisible(false);
  };

  const userLoggedOut = async () => {
    await Signout();
    navigation.navigate("TabNav");
  };

  const getUserInfo = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var userId = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.MetaData + userId;
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
          var userInfo = response.data;
          setLoading(false);
          setUserData({
            ...userData,
            userId: userInfo.id,
            userProfile: userInfo.profile,
            userEmail: userInfo.email,
            userName: userInfo.username,
            firstName: userInfo.first_name,
            middleName: userInfo.middle_name,
            lastName: userInfo.last_name,
            following: response.following,
          });

          setDetailInfo(userInfo);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    const InternetConnection = async () => {
      const networkState = await NetInfo.fetch();
      setConnection(networkState.isConnected);
    };
    InternetConnection();
    getUserInfo();

    const subscription = NetInfo.addEventListener(async (state) => {
      setConnection(state.isConnected);
    });
    return () => {
      subscription();
    };
  }, [retry]);

  useEffect(() => {
    (async () => {
      const gallerStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(gallerStatus.status === "granted");
    })();

    return () => {};
  }, []);

  useEffect(() => {
    setImage(Connection.url + Connection.assets + userData.userProfile);

    return () => {};
  }, [userData.userProfile]);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background.darker }}>
      {connection ? (
        loading ? (
          <ProfileShimmer />
        ) : (
          <View>
            <View
              style={[
                styles.profileContainer,
                { backgroundColor: theme.primary.main },
              ]}
            >
              <Pressable
                onPress={() => setModalVisible(true)}
                disabled={btnstate}
                style={styles.profilePicker}
              >
                <Avatar.Image
                  source={image ? { uri: image } : p2bavatar}
                  size={80}
                  style={styles.profileImage}
                  onPress={() => setModalVisible(true)}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => selectProfileImage()}
                  style={styles.cameraIcon}
                >
                  {updatingProfile === "camera" ? (
                    <MaterialCommunityIcons
                      name="camera"
                      size={18}
                      color={theme.dark[900]}
                    />
                  ) : updatingProfile === "loading" ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.primary.main}
                    />
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
                </TouchableOpacity>
              </Pressable>

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
                    {Nameformatter(userData.firstName, userData.middleName)}
                  </Text>
                </View>

                <View style={{ alignSelf: "center", alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: Typography.family,
                      fontSize: Typography.size.headingthree,
                      fontWeight: Typography.weight.Boldtwo,
                      paddingHorizontal: 6,
                    }}
                  >
                    {userData.userEmail}
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
                    {userData.following}
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
                  style={[
                    styles.rightarrow,
                    { position: "absolute", right: 10 },
                  ]}
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
                  style={[
                    styles.rightarrow,
                    { position: "absolute", right: 10 },
                  ]}
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
                  style={[
                    styles.rightarrow,
                    { position: "absolute", right: 10 },
                  ]}
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
                  style={[
                    styles.rightarrow,
                    { position: "absolute", right: 10 },
                  ]}
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
                  style={[
                    styles.rightarrow,
                    { position: "absolute", right: 10 },
                  ]}
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
          </View>
        )
      ) : (
        <NoConnection />
      )}

      <LogoutDialog
        visible={dialogVisible}
        onCancel={handleCancel}
        onLogout={handleLogout}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={Constants.Inverse}
              />
            </TouchableOpacity>
            <Image
              source={image ? { uri: image } : p2bavatar}
              resizeMode="contain"
              style={styles.modalImage} //featured image styles
            />
          </View>
        </View>
      </Modal>
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
  //modal for profile image to be shown in full screen size
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0009",
  },
  modalView: {
    alignItems: "center",
    aspectRatio: 1,
  },
  modalImage: {
    width: Dimensions.get("screen").width,
    height: 400,
    resizeMode: "contain",
  },
  button: {
    alignSelf: "flex-end",
    borderRadius: 50,
    padding: 7,
    margin: 10,

    elevation: 2,
  },

  buttonClose: {
    backgroundColor: Constants.Faded,
    position: "absolute",
    top: 6,
    right: 2,
    zIndex: 10,
  },
  textStyle: {
    color: Constants.Danger,
    fontWeight: Constants.Bold,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  eventList: {},
});

export default Profile;
