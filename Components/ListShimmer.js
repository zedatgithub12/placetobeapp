//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Constants from '../constants/Constants';

// create a component
const Listing = () => {
    return (
      <SkeletonPlaceholder>
          <View style={styles.listContainer}>
            <View style={styles.imageContainer} />
            <View style={{width:'70%'}}>
                <View style={styles.title}/>
                <View style={styles.date}/>
                <View style={styles.date}/>
                <View style={styles.price}/>
            </View>
            {
       // <View style={{width:22, height:22, borderRadius:10,  marginTop:3,}} />
            }
         
          </View>
      </SkeletonPlaceholder>
    );
};

// define your styles
const styles = StyleSheet.create({
 
    listContainer: {
        flexDirection: "row",
        height:100,
       marginTop:12,
       marginLeft:12
      },
      imageContainer:{
         borderRadius: Constants.mediumbox,
        width:100, 
        height:100,
        padding:2,
      },
      title:{
          marginLeft:10,
          marginTop:3,
        width:'70%', 
        height:22,
        borderRadius: 3,
      },
      date:{
        marginLeft:10,
        marginTop:5,
      width:'40%', 
      height:17,
      borderRadius: 3,
      },
      price:{
        marginLeft:10,
        marginTop:5,
      width:'25%', 
      height:17,
      borderRadius: 3,
      }
});

//make this component available to the app
export default Listing;
