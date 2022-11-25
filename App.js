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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signin from "./Screens/Signin";
import SignUp from "./Screens/Signup";
import TabNav from "./Screens/Tabs";
import Notifications from "./Screens/Notifications";
//import Organizers from "./Screens/Organizers";
import Bookmarks from "./Screens/Bookmarks";
import Setting from "./Screens/Setting";
import Profile from "./Screens/ProfileScreen";
import EventDetails from "./Screens/eventDetails";
import { Caption } from "react-native-paper";
import Constants from "./constants/Constants";
import { AuthContext } from "./Components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GallerDetail from "./Screens/GalleryDetail";
import CategorizedEvent from "./Screens/CategorizedEvent";
import UserDetails from "./Screens/UserDetails";
import store from "./store/store";
//import notices from "./store/noticestore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import YourEvents from "./Screens/YourEvents";
import YoursDetail from "./Screens/YourEventDetails";
import OrganizersDetail from "./Screens/OrganizersDetails";
import Questions from "./Screens/AskQuestion";
import About from "./Screens/About";
import * as Linking from "expo-linking";
import ForgotPass from "./Screens/ForgotPassword";
import NetInfo from "@react-native-community/netinfo";
import Followers from "./Screens/Followers";
import Following from "./Screens/Following";
import Filter from "./Screens/Filter";
import AddTicket from "./Screens/AddTicket";
import AddingTicketSucceed from "./Screens/AddingTicketSucceed";
import TicketDetail from "./Screens/TicketDetail";
import * as Animatable from "react-native-animatable";
import Tickets from "./Screens/TicketScreen";
import UpdateTicket from "./Screens/UpdateTicket";
import UpdateEvent from "./Screens/UpdateEvent";
import UpdateSucceed from "./Screens/UpdateSucceed";
import CheckoutScreen from "./Screens/CheckoutScreen";
import PaymentScreen from "./Screens/PaymentScreen";

const Stack = createNativeStackNavigator();
const persistor = persistStore(store);
const prefix = Linking.createURL("com.afromina.placetobe://");

export default function App() {
  // const [isLoading, setIsLoading] = React.useState(true);
  //const [userToken, setUserToken] = React.useState(null);
  const p2blinking = {
    prefixes: [prefix],
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
    formOne: async (image, eventName, eventDesc) => {
      if (image == image && eventName == eventName && eventDesc == eventDesc) {
        setEventInfo({
          ...eventInfo,
          eventTitle: eventName,
          eventDescription: eventDesc,
          featuredImage: image,
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
      eventEntrance
    ) => {
      if (
        eventOrganizer == eventOrganizer &&
        eventCategory == eventCategory &&
        eventAddress == eventAddress &&
        eventEntrance == eventEntrance
      ) {
        setEventInfo({
          ...eventInfo,
          eventOrg: eventOrganizer,
          eventCat: eventCategory,
          eventAddr: eventAddress,
          entranceFee: eventEntrance,
        });
      }
    },
    formFour: async (
      eventLocationLatitude,
      eventLocationLongtude,
      eventContactPhone,
      eventLink
    ) => {
      if (
        eventLocationLatitude == eventLocationLatitude &&
        eventLocationLongtude == eventLocationLongtude &&
        eventContactPhone == eventContactPhone &&
        eventLink == eventLink
      ) {
        setEventInfo({
          ...eventInfo,
          locationLatitude: eventLocationLatitude,
          locationLongitude: eventLocationLongtude,
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
        } catch (e) {
          console.log(e);
        }
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
    }, 6000);
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
          source={require("./assets/splash.png")}
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
          <NavigationContainer linking={p2blinking}>
            <StatusBar style={Constants.Inverse} />
            {connectionState ? (
              <Stack.Navigator headerMode="none" initialRouteName="TabNav">
                <Stack.Screen
                  name="TabNav"
                  component={TabNav}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SignIn"
                  component={Signin}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SignUp}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Notifications" component={Notifications} />

                <Stack.Screen
                  name="Settings"
                  component={Setting}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                  }}
                />
                <Stack.Screen
                  name="Account Settings"
                  component={UserDetails}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                  }}
                />
                <Stack.Screen
                  name="Bookmarks"
                  component={Bookmarks}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="EventDetail"
                  component={EventDetails}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="GalleryDetail"
                  component={GallerDetail}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Eventcat"
                  component={CategorizedEvent}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Filter"
                  component={Filter}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="yourEvents"
                  component={YourEvents}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="YoursDetail"
                  component={YoursDetail}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Organizer Detail"
                  component={OrganizersDetail}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Questions"
                  component={Questions}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerTitle: "Questions and Feedback",
                  }}
                />
                <Stack.Screen
                  name="About"
                  component={About}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerTitle: "About us",
                  }}
                />

                <Stack.Screen
                  name="ForgotPass"
                  component={ForgotPass}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Followers"
                  component={Followers}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="Following"
                  component={Following}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="Add Ticket"
                  component={AddTicket}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />

                <Stack.Screen
                  name="Ticket Added"
                  component={AddingTicketSucceed}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="Ticket Detail"
                  component={TicketDetail}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />

                <Stack.Screen
                  name="My Tickets"
                  component={Tickets}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />

                <Stack.Screen
                  name="Update Ticket"
                  component={UpdateTicket}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="Update Event"
                  component={UpdateEvent}
                  options={{
                    title: "Update",
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Update Succeed"
                  component={UpdateSucceed}
                  options={{
                    title: "Updated",
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                    headerShown: false,
                  }}
                />
                
                <Stack.Screen
                  name="TicketScreen"
                  component={PaymentScreen}
                  options={{
                    headerStyle: {
                      backgroundColor: Constants.primary,
                    },
                    headerTintColor: Constants.background,
                    headerShadowVisible: false,
                  }}
                />
               
          
{/* 
                <Stack.Screen
                  name="Checkout Screen"
                  component={CheckoutScreen}
                  options={{
                    title: "Checkout Screen",
                    headerStyle: {
                      backgroundColor: "white",
                      headerBackButtonMenuEnabled: "true",
                    },
                    headerTitleAlign: "center",
                    headerTintColor: "#000000",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  }}
                /> */}
              </Stack.Navigator>
            ) : (
              <View style={styles.noConnection}>
                <Image
                  source={require("./assets/connect.png")}
                  style={styles.connImage}
                  resizeMode="contain"
                />
                <Image
                  source={require("./assets/icon.png")}
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
});
