import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TodaysEvents from "./TodaysEvent";
import ThisWeekEvents from "./ThisWeekEvent";
import UpcomingEvents from "./UpcomingEvent";
import Constants from "../constants/Constants";
import {SimpleLineIcons} from "react-native-vector-icons";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Happening"
      screenOptions={{
        tabBarActiveTintColor:Constants.background,
        tabBarInactiveTintColor: Constants.Inverse,
  
        tabBarLabelStyle: {
          borderRadius: Constants.borderRad,
         
          paddingHorizontal: 4,
          fontWeight: Constants.Bold,
          
        },
        tabBarIndicatorStyle: {
          backgroundColor: Constants.background,
        },
        tabBarPressColor: Constants.Faded,
        swipeEnabled: true,

        tabBarStyle:{
          
        shadowColor: Constants.lightPurple,
        backgroundColor: Constants.primary,
        borderTopWidth:0.3,
        borderColor: Constants.primary,
    
        },
      
      }}
    >
      <Tab.Screen name="Happening" component={TodaysEvents} />
      <Tab.Screen name="This Week" component={ThisWeekEvents} />
      <Tab.Screen name="Upcoming" component={UpcomingEvents} />
    </Tab.Navigator>
  );
}
export default MyTabs;
