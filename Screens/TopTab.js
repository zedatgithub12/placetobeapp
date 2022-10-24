import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TodaysEvents from "./TodaysEvent";
import ThisWeekEvents from "./ThisWeekEvent";
import UpcomingEvents from "./UpcomingEvent";
import Constants from "../constants/Constants";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Happening"
      screenOptions={{
        tabBarActiveTintColor:Constants.primary,
        tabBarInactiveTintColor: Constants.purple,

        tabBarLabelStyle: {
          borderRadius: Constants.borderRad,
          padding: 3,
          paddingHorizontal: 4,
          fontWeight: Constants.Bold,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Constants.primary,
        },
        tabBarPressColor: Constants.Faded,
        swipeEnabled: true,

        tabBarStyle:{
        shadowColor: Constants.primary
         
        }
      }}
    >
      <Tab.Screen name="Happening" component={TodaysEvents} />
      <Tab.Screen name="This Week" component={ThisWeekEvents} />
      <Tab.Screen name="Upcoming" component={UpcomingEvents} />
    </Tab.Navigator>
  );
}
export default MyTabs;
