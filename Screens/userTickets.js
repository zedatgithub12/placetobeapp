//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BoughtTicket from "../Components/BoughtTicket";
// create a component
const UserTickets = () => {
    return (
        <View style={styles.container}>
           <BoughtTicket/>
           <BoughtTicket/>
           <BoughtTicket/>
           <BoughtTicket/>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
      
    },
});

//make this component available to the app
export default UserTickets;
