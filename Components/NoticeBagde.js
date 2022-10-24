//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const NoticeCounter = () => {

    const { newNotice } = React.useContext(AuthContext);
// function to be called when server respond with notice count
    const updateCount =(noticeCount)=>{
        newNotice(noticeCount);
    }
    const [notification, setNotification] = React.useState();

    // a function which will retrieve the count of the notice
    const RefreshList = async() => {
        
        let id = await AsyncStorage.getItem("userId");
      
     
        var ApiUrl = Connection.url + Connection.notification;
        //The event happening today is fetched on the useEffect function called which is componentDidMuount in class component
        
        
        var userIdentity = {
          userId: id,
        };
        var headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
       
        fetch(ApiUrl, {
          method: "POST",
          body: JSON.stringify(userIdentity),
          headers: headers,
        })
          .then((response) => response.json()) //check response type of the API
          .then((response) => {
            var message = response[0].message;
            
          
              // handle success
              const filter=(data)=>{
             return data !== null;
              }
              if (message === "succeed") {
                var result = response[0].Notification;
                var notice = result.filter(filter);
                //var noticed = notice.sort(notice.start_date);
    
                const noticed = notice.sort(
                  (objA, objB) => Number(objB.addedDate) - Number(objA.addedDate),
                );
               
                setNotification(noticed);
                updateCount(noticed.length);
                console.log(noticed);
           
              } else if (message === "no event") {
                setNotification(notice);
       
              } 
              else if(message = "follow organizers"){
                setNotification(notice);
             
              }
                else {
                  //setLoading(false);
              }
            
          })
        
        };    

        useEffect(() => {
            RefreshList();
            return ()=>{};
          });

    return (
        <View style={styles.container}>
            <Text>{notification.length}</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default NoticeCounter;
