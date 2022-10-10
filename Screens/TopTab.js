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
        tabBarActiveTintColor: Constants.primary,
        tabBarInactiveTintColor: Constants.mainText,

        tabBarLabelStyle: {
          borderRadius: Constants.borderRad,
          padding: 3,
          paddingHorizontal: 8,
          fontWeight: Constants.Bold,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Constants.primary,
        },
        tabBarPressColor: Constants.primary,
      
      }}
    >
      <Tab.Screen name="Happening" component={TodaysEvents} />
      <Tab.Screen name="This Week" component={ThisWeekEvents} />
      <Tab.Screen name="Upcoming" component={UpcomingEvents} />
    </Tab.Navigator>
  );
}
export default MyTabs;
