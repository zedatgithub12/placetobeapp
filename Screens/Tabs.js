import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Constants from "../constants/Constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./HomeScreen";
import { Feather,Ionicons} from "react-native-vector-icons";
import EventSubmission from "./SubmitEvent";
import Notifications from "./Notifications";


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
          width: 50,
          height: 50,
          borderRadius: 35,
          backgroundColor: Constants.primary,
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
        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          elevation: 0,
          backgroundColor: Constants.background,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          
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
              name="home"
              size={28}
              color={color}
            />
          ),
          tabBarActiveTintColor: Constants.primary,
          tabBarInactiveTintColor: Constants.Secondary,
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
        headerTintColor: Constants.background,
          tabBarIcon: ({ focused }) => (
            <Feather name="plus" size={32} color={Constants.background} />
          ),
          tabBarButton: (props) => <AddEvent {...props} />,
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
         headerTintColor: Constants.background,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="notifications"
              size={28}
              color={color}
            />
          ),
          tabBarActiveTintColor: Constants.primary,
          tabBarInactiveTintColor: Constants.Secondary,
          
   
          
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
    backgroundColor: Constants.background
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
});

export default TabNav;
