import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import VenueListing from './VenueList';
import Constants from "../constants/Constants";
import VenueMap from "./VenueMap";

const Tab = createMaterialTopTabNavigator();

function VenueTab() {
  return (
    <Tab.Navigator
      initialRouteName="Listing"
      screenOptions={{
        tabBarActiveTintColor: Constants.iconColor,
        tabBarInactiveTintColor: Constants.mainText,

        tabBarLabelStyle: {
          borderRadius: Constants.borderRad,
          padding: 3,
          paddingHorizontal: 8,
          fontWeight: Constants.Bold,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Constants.iconColor,
        },
        tabBarPressColor: Constants.iconColor,
  
      }}
    >
      <Tab.Screen name="Listing" component={VenueListing} />
      <Tab.Screen name="Maps" component={VenueMap} />
    
    </Tab.Navigator>
  );
}

export default VenueTab;
