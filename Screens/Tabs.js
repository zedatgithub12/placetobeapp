import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Button } from "react-native";
import Constants from "../constants/Constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./HomeScreen";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
} from "react-native-vector-icons";
import EventSubmission from "./SubmitEvent";
import Notifications from "./Notifications";
import Events from "./Events";
import UserTickets from "./userTickets";
const Tab = createBottomTabNavigator();
const AddEvent = ({ children, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={styles.add_event}
    onPress={onPress}
  >
    <View
      style={
        (styles.addEventVeiw,
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: Constants.primary,
          margin: 14,
        })
      }
    >
      {children}
    </View>
  </TouchableOpacity>
);

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
        name="Events"
        component={Events}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.Inverse,

          tabBarIcon: ({ focused, color }) => (
            <SimpleLineIcons name="calendar" size={21} color={color} />
          ),
          tabBarActiveTintColor: Constants.primary,
          tabBarInactiveTintColor: Constants.Inverse,
        }}
      />

      <Tab.Screen
        name="Add Event"
        component={EventSubmission}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Constants.primary,
          },
          headerTintColor: Constants.Inverse,
          tabBarLabel: "Add Event",

          tabBarIcon: ({ focused, color }) => (
            <SimpleLineIcons name="plus" size={24} color={color} />
          ),
          // tabBarButton: (props) => <AddEvent {...props} />,

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
          headerRight: () => (
            <TouchableOpacity onPress={() => alert("This is a button!")} style={styles.menubtn}>
              <MaterialCommunityIcons name="dots-vertical" size={22} color={Constants.Inverse}/>
            </TouchableOpacity>
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
  menubtn:{
    marginRight:12,
    marginTop:6,
  }
});

export default TabNav;
