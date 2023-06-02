//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground,Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Constants from "../constants/Constants";
import { Avatar, Paragraph, Title } from "react-native-paper";
// create a component
const CustomDrawer = (props) => {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:Constants.background}}>
        <ImageBackground source={require("../assets/images/Profilebackground.jpg")}  style={styles.profileBackground}>
          <Image source={require("../assets/images/profile.png")} style={styles.profilePicture}/>
          <Title style={styles.username}>Anteneh Tesfaye</Title>
          <Paragraph>antexte@gmail.com</Paragraph>
        </ImageBackground>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
          <Text>Our Custom Text</Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileBackground:{
      padding:20,
      
      
  },
  profilePicture:{
      width:80,
      height:80,
      borderRadius:40,
     
  },
  username:{
      color:Constants.Inverse,
      fontSize:Constants.headingone,
      fontWeight:Constants.Bold,
      fontFamily: Constants.fontFam,
  }
});

//make this component available to the app
export default CustomDrawer;
