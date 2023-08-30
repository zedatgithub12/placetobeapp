import React from "react";
import { StyleSheet } from "react-native";
import Constants from "../../constants/Constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Home/HomeScreen";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Notifications from "../Notifications/Notifications";
import UserTickets from "../Tickets/userTickets";
import Bookmarks from "../Others/Bookmarks";
import { useSelector } from "react-redux";
import { NotificationsTab } from "./components/Notification";

const Tab = createBottomTabNavigator();

function TabNav() {
  const notificationcount = useSelector(
    (state) => state.counts.notificationCount
  );
  return (
    <Tab.Navigator
      screenOptions={() => ({
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
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
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
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={22}
              color={color}
            />
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
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={22}
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
            <NotificationsTab
              focused={focused}
              color={color}
              notificationCount={notificationcount}
            />
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
