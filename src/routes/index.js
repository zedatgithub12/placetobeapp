//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//event screens import
import EventDetails from "../Screens/Event/eventDetails";
import CategorizedEvent from "../Screens/Event/CategorizedEvent";
import YourEvents from "../Screens/Event/YourEvents";
import UpdateEvent from "../Screens/Event/UpdateEvent";
import UpdateSucceed from "../Screens/Event/UpdateSucceed";
import YoursDetail from "../Screens/Event/YourEventDetails";

// gallery screens import
import GallerDetail from "../Screens/Gallery/GalleryDetail";

// Notification screens import
import Notifications from "../Screens/Notifications/Notifications";

// Organizers screens import
import OrganizersDetail from "../Screens/Organizers/OrganizersDetails";
// Tabs screens import
import TabNav from "../Screens/Tabs/Tabs";
// Tickets screens import
import AddTicket from "../Screens/Tickets/AddTicket";
import AddingTicketSucceed from "../Screens/Tickets/AddingTicketSucceed";
import EventTickets from "../Screens/Tickets/EventTickets";
import TicketDetail from "../Screens/Tickets/TicketDetail";
import Tickets from "../Screens/Tickets/OrganizerTickets.js/MyTickets";
import UpdateTicket from "../Screens/Tickets/UpdateTicket";
import CheckoutScreen from "../Screens/Tickets/CheckoutScreen";
import BoughtDetail from "../Screens/Tickets/BoughtTicketDetail";
// Users screens import
import Signin from "../Screens/Users/Signin";
import SignUp from "../Screens/Users/Signup";
import Profile from "../Screens/Users/ProfileScreen";
import Setting from "../Screens/Users/Setting";
import ForgotPass from "../Screens/Users/ForgotPassword";
import Followers from "../Screens/Users/Followers";
import Following from "../Screens/Users/Following";
import UserDetails from "../Screens/Users/UserDetails";
// Other screens import
import Bookmarks from "../Screens/Others/Bookmarks";
import Questions from "../Screens/Others/AskQuestion";
import About from "../Screens/Others/About";
import Filter from "../Screens/Others/Filter";
//import Organizers from "./Screens/Organizers";

//other imports
import Constants from "../constants/Constants";
/********************************* ROUTES SCREEN ****************************** */

const Stack = createNativeStackNavigator();
// create a component
const Routes = () => {
  return (
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
        component={EventTickets}
        options={{
          title: "Tickets",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.background,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="Checkout Screen"
        component={CheckoutScreen}
        options={{
          title: "Checkout",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.background,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="BoughtDetail"
        component={BoughtDetail}
        options={{
          title: "Purchased Ticket Details",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.Inverse,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: Constants.headingone,
          },
        }}
      />
    </Stack.Navigator>
  );
};

//make this component available to the app
export default Routes;
