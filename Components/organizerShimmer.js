//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Constants from '../constants/Constants';
import Listing from './ListShimmer';
import OrgShimmer from './orgShimmer';

// create a component
const OrganizersShimmer = () => {
    return (
      <View>
     <SkeletonPlaceholder>
           <View style={styles.header}/>
            
            <View style={styles.organizerInfoContainer}>

            <View style={[styles.profilePicker,{backgroundColor: Constants.Faded}]}/>
            <View style={{width:'50%'}}>
              <View style={styles.title}/>
              <View style={styles.category}/>
              <View style={styles.followers}/>
            </View>

            <View style={{width:'25%', }}>
                <View style={styles.callButton}/>
                <View style={styles.followButton}/>
            </View>
            </View>

     </SkeletonPlaceholder>
     <OrgShimmer/>
     <OrgShimmer/>
     <OrgShimmer/>
     <OrgShimmer/>
     <OrgShimmer/>
     </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    header: {
       width:'100%',
       height:200,
    },
    organizerInfoContainer:{
        flexDirection:'row',
        padding: 15,
    },
    profilePicker: {
        width: 80,
        height: 80,
        marginLeft: 10,
        borderRadius: 43,
        padding: 3.8,
        elevation: 2,
        shadowColor: Constants.Secondary,
      },
      title:{
        marginLeft:15,
        marginTop:7,
      width:'90%', 
      height:20,
      borderRadius: 3,
    },
    category:{
      marginLeft:15,
      marginTop:5,
    width:'50%', 
    height:15,
    borderRadius: 3,
    },
    followers:{
        marginLeft:15,
        marginTop:5,
      width:'40%', 
      height:15,
      borderRadius: 3,
    },
    callButton:{
        width: '90%',
        height:25,
        borderRadius:3,
        marginTop:7,
        marginLeft:10,
    },
    followButton:{
        width: '90%',
        height:25,
        borderRadius:3,
        marginTop:8,
        marginLeft:10,
    },
    listingContainer:{
        width:'98%',
    }
});

//make this component available to the app
export default OrganizersShimmer;
