//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Constants from '../constants/Constants';
// create a component
const NoticeShimmer = () => {
    return (
     <SkeletonPlaceholder>
         <View style={{flexDirection:'row', alignItems:'center',marginTop:8}}>

             <View style={styles.noticeIcon}/>
                  
                  <View style={styles.noticeContentContainer}>
                 <View style={styles.organizer}/>
                 <View style={styles.title}/>

                 <View style={styles.BottomContent}>
                       <View style={styles.starton}/>
                       <View style={styles.date}/>
                       <View style={styles.time}/>
                 </View>
                  </View>


         </View>
     </SkeletonPlaceholder>
    );
};

// define your styles
const styles = StyleSheet.create({
    noticeIcon:{
    width:50,
    height:50,
    borderRadius: 25,
    marginLeft:10,
    },
    noticeContentContainer:{
       width: '90%',
       height:80,
       padding:10,
       marginTop:8,
    },
    organizer:{
          width:'90%',
          height:15,
          borderRadius:3,
    },
    title:{
        width:'75%',
        height:13,
        borderRadius:3,
        marginTop:8
    },
    BottomContent:{
    flexDirection:'row',
   alignItems:'center',
   marginTop:10
    },
    starton:{
        width:70,
        height:12,
        borderRadius:3,
       
    },
    date:{
        width:70,
        height:12,
        borderRadius:3,
        marginLeft:5,
    },
    time:{
        width:70,
        height:12,
        borderRadius:3,
        marginLeft:5,
    }
});

//make this component available to the app
export default NoticeShimmer;
