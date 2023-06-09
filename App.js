import React, { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
//import Organizers from "./Screens/Organizers";
import { Caption } from "react-native-paper";
import Constants from "./src/constants/Constants";
import { AuthContext } from "./src/Components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./src/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import * as Linking from "expo-linking";
import NetInfo from "@react-native-community/netinfo";
import * as Animatable from "react-native-animatable";
import Geolocation from "@react-native-community/geolocation";
import { LocalNotification } from "./src/Utils/localPushController";
import RemotePushController from "./src/Utils/RemotePushController";
import Routes from "./src/routes";

Geolocation.getCurrentPosition((info) => info.coords.latitude);
const persistor = persistStore(store);
const link = Linking.createURL("/");
const app = Linking.createURL("com.afromina.placetobe://");
const Domain = Linking.createURL("www.p2b-ethiopia.com");
const subDomain = Linking.createURL("www.*.p2b-ethiopia.com");

export default function App() {
  const handleNotification = () => {
    LocalNotification();
  };

  const Linkings = {
    prefixes: [link, app, Domain, subDomain],
    config: {
      initialRouteName: "TabNav",
      screens: {
        TabNav: {
          path: "tabNav",
        },
        Profile: {
          path: "profile",
        },
        EventDetail: {
          path: "eventdetail/:externalLink",
        },
      },
    },
  };

  const initialLoginState = {
    isLoading: true,
  };

  //a constant which store a state of event field input datas
  // the information collected from all input field will be store here
  // the state is going to be updated inside the context function which trigger the value from the component
  const [eventInfo, setEventInfo] = useState({
    featuredImage: "",
    eventTitle: "",
    eventDescription: "",
    startingDay: "",
    startingTime: "",
    endingDay: "",
    endingTime: "",
    eventOrg: "",
    eventCat: "",
    eventAddr: "",
    entranceFee: "",
    locationLatitude: "",
    locationLongitude: "",
    contactPhone: "",
    redirectLink: "",
    imageStatus: false,
  });
  const [user, setUser] = React.useState({
    userId: "",
    userTokens: "",
    userEmail: "",
    profile: "",
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    category: "",
    phone: "",
    status: "",
    logged: false,
  });

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          email: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          email: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          email: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  // notification bagde context state

  // a useContext hook values which going to be used through the app component
  // the context value is named authContext
  const authContext = React.useMemo(() => ({
    // this function retrive user information from async storage
    // and assign it to variable corressponding to its name
    // this function is going to be called inside homescreen onPress profile icon on the left corner of the screen
    userStatus: {
      logged: user.logged,
    },

    userInfoFunction: async () => {
      var id = await AsyncStorage.getItem("userId");
      var token = await AsyncStorage.getItem("userToken");
      var emailAddress = await AsyncStorage.getItem("userEmail");
      var profile = await AsyncStorage.getItem("profile");
      var username = await AsyncStorage.getItem("username");
      var Fname = await AsyncStorage.getItem("FirstName");
      var Mname = await AsyncStorage.getItem("MiddleName");
      var lname = await AsyncStorage.getItem("lastName");
      var gender = await AsyncStorage.getItem("gender");
      var category = await AsyncStorage.getItem("category");
      var phone = await AsyncStorage.getItem("phone");
      var status = await AsyncStorage.getItem("status");

      setUser({
        ...user,
        userId: id,
        userTokens: token,
        userEmail: emailAddress,
        profile: profile,
        username: username,
        firstName: Fname,
        middleName: Mname,
        lastName: lname,
        gender: gender,
        category: category,
        phone: phone,
        status: status,
      });
    },
    // user infromation is stored inside userInformation obejct and accessed from profile screen
    userInformation: {
      userId: user.userId,
      userTokens: user.userTokens,
      userEmail: user.userEmail,
      profile: user.profile,
      username: user.username,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      gender: user.gender,
      category: user.category,
      phone: user.phone,
      status: user.status,
    },
    formOne: async (image, eventName, eventDesc, poster) => {
      if (image == image && eventName == eventName && eventDesc == eventDesc) {
        setEventInfo({
          ...eventInfo,
          eventTitle: eventName,
          eventDescription: eventDesc,
          featuredImage: image,
          imageStatus: poster,
        });
      }
    },

    formTwo: async (startDate, startTime, endDate, endTime) => {
      if (
        startDate == startDate &&
        startTime == startTime &&
        endDate == endDate &&
        endTime == endTime
      ) {
        setEventInfo({
          ...eventInfo,
          startingDay: startDate,
          startingTime: startTime,
          endingDay: endDate,
          endingTime: endTime,
        });
      }
    },
    formThree: async (
      eventOrganizer,
      eventCategory,
      eventAddress,
      eventLocationLatitude,
      eventLocationLongtude,
      eventEntrance
    ) => {
      if (
        eventOrganizer == eventOrganizer &&
        eventCategory == eventCategory &&
        eventAddress == eventAddress &&
        eventLocationLatitude == eventLocationLatitude &&
        eventLocationLongtude == eventLocationLongtude &&
        eventEntrance == eventEntrance
      ) {
        setEventInfo({
          ...eventInfo,
          eventOrg: eventOrganizer,
          eventCat: eventCategory,
          eventAddr: eventAddress,
          locationLatitude: eventLocationLatitude,
          locationLongitude: eventLocationLongtude,
          entranceFee: eventEntrance,
        });
      }
    },
    formFour: async (eventContactPhone, eventLink) => {
      if (eventContactPhone == eventContactPhone && eventLink == eventLink) {
        setEventInfo({
          ...eventInfo,

          contactPhone: eventContactPhone,
          redirectLink: eventLink,
        });
      }
    },
    // this object stores all data collected from the input field and while user press submit button
    //this object is going to be accessed inside submit event component
    InputForm: {
      userId: user.userId,
      userTokens: user.userTokens,
      FeaturedImage: eventInfo.featuredImage,
      imageStatus: eventInfo.imageStatus,
      eventNamed: eventInfo.eventTitle,
      aboutEvent: eventInfo.eventDescription,
      sDate: eventInfo.startingDay,
      sTime: eventInfo.startingTime,
      eDate: eventInfo.endingDay,
      eTime: eventInfo.endingTime,
      eOrg: eventInfo.eventOrg,
      eCat: eventInfo.eventCat,
      eAddress: eventInfo.eventAddr,
      TicketPrice: eventInfo.entranceFee,
      mLat: eventInfo.locationLatitude,
      mLong: eventInfo.locationLongitude,
      cPhone: eventInfo.contactPhone,
      url: eventInfo.redirectLink,
    },

    SignIn: async (userId, userToken, email, password, profile) => {
      if (email == email && password == password) {
        try {
          let store;
          await AsyncStorage.multiSet(
            [
              ["userId", userId],
              ["userToken", userToken],
              ["profile", profile],
            ],
            store
          );
        } catch (e) {
          console.log(e);
        }
        setUser({
          ...user,
          logged: true,
        });
      }

      dispatch({ type: "LOGIN", id: email, token: userToken });
    },
    SignUp: () => {
      //setUserToken('eromayet01');
      // setIsLoading(false);
    },
    GoogleSignIn: async (userId, userToken, email, id, profile) => {
      if (email == email && id == id) {
        setUser({
          ...user,
          logged: true,
        });

        try {
          let store;
          await AsyncStorage.multiSet(
            [
              ["userId", userId],
              ["userToken", userToken],
              ["profile", profile],
            ],
            store
          );
        } catch (e) {}
      }

      dispatch({ type: "LOGIN", id: email, token: userToken });
    },

    Signout: async () => {
      setUser({
        ...user,
        logged: false,
      });

      let keys = [
        "userToken",
        "userId",
        "userEmail",
        "profile",
        "FirstName",
        "MiddleName",
        "lastName",
        "gender",
        "category",
        "phone",
        "status",
      ];
      try {
        await AsyncStorage.multiRemove(keys);
      } catch (e) {}

      dispatch({ type: "LOGOUT" });
    },
  }));

  const [connectionState, setConnectionState] = useState(false);
  const [retry, setRetry] = useState();

  const Referesh = () => {
    setRetry(!retry);
  };

  useEffect(() => {
    setTimeout(async () => {
      try {
        var userToken = await AsyncStorage.getItem("userToken");
        if (userToken.length !== 0) {
          setUser({
            ...user,
            logged: true,
          });
        }
      } catch (e) {
        //
      }

      dispatch({ type: "REGISTER", token: userToken });
    }, 4000);
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setConnectionState(true);
      }
    });

    return () => {};
  }, [retry]);

  //activity indicator which is going to be shown and the opening of app
  if (loginState.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#292b2c",
          paddingBottom: 30,
        }}
      >
        <Animatable.Image
          animation="zoomIn"
          source={require("./src/assets/images/splash.png")}
          style={{ height: 300, width: 300 }}
        />
        <ActivityIndicator size="small" color={Constants.primary} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer
            linking={Linkings}
            fallback={
              <View style={styles.loader}>
                <ActivityIndicator color={Constants.primary} size="large" />
                <RemotePushController />
              </View>
            }
          >
            <StatusBar style={Constants.Inverse} />
            {connectionState ? (
              <Routes />
            ) : (
              <View style={styles.noConnection}>
                <Image
                  source={require("./src/assets/images/connect.png")}
                  style={styles.connImage}
                  resizeMode="contain"
                />
                <Image
                  source={require("./src/assets/images/icon.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text>No Connection</Text>
                <Caption>Please Check your internet connection</Caption>
                <TouchableOpacity
                  onPress={() => Referesh()}
                  style={styles.eventsBtn}
                >
                  <Text style={styles.eventstxt}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </NavigationContainer>
        </AuthContext.Provider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  noConnection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  connImage: {
    height: "50%",
    width: "90%",
  },
  eventsBtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.primary,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventstxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.background,
  },
  icon: {
    width: 80,
    height: 80,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
