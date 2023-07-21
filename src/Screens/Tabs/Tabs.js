import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "../../constants/Constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Home/HomeScreen";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "react-native-vector-icons";
import EventSubmission from "../Event/SubmitEvent";
import Notifications from "../Notifications/Notifications";
import Events from "../Event/Events";
import UserTickets from "../Tickets/userTickets";
import Bookmarks from "../Others/Bookmarks";
const Tab = createBottomTabNavigator();

function TabNav({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          padding: 8,
          paddingBottom: 3,
          elevation: 0,
          backgroundColor: Constants.Faded,
          height: 54,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,

          tabBarIcon: ({ focused, color }) => (
            <Feather name="home" size={22} color={color} />
          ),
          tabBarActiveTintColor: Constants.primary,
          tabBarInactiveTintColor: Constants.Inverse,
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.Inverse,

          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
          tabBarActiveTintColor: Constants.primary,
          tabBarInactiveTintColor: Constants.Inverse,
        }}
      />

      <Tab.Screen
        name="Tickets"
        component={UserTickets}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.Inverse,
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="ticket-confirmation-outline"
              size={26}
              color={color}
            />
          ),

          tabBarActiveTintColor: Constants.primary,
          tabBarInactiveTintColor: Constants.Inverse,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.Inverse,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
          tabBarActiveTintColor: Constants.primary,
          tabBarInactiveTintColor: Constants.Inverse,
        }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.Faded,
  },
  profileButton: {
    backgroundColor: Constants.primary,
  },
  add_event: {
    top: -4,
    alignItems: "center",
    justifyContent: "center",
  },
  addEventVeiw: {
    shadowColor: Constants.primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 3.5,
    elevation: 5,
    padding: 8,
  },
  menubtn: {
    marginRight: 12,
    marginTop: 6,
  },
});

export default TabNav;
