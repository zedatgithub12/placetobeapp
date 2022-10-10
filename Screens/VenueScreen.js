import React from 'react';
import { View,StyleSheet, Text, TextInput } from 'react-native';
import Constants from "../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import VenueTab from './VenueTab';



function Venues({ navigation }){
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.VenuesTitle}>Event Venues </Text>
        <View style={styles.headers}>
        <View style={styles.SearchFieldContainer}>
          <Ionicons name="search-outline" size={22} />
          <TextInput
            placeholder="Search for Venues"
            style={styles.SearchField}
          />
        </View>
        </View>
        
        <VenueTab/>
        </SafeAreaView>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: Constants.background
        
    },
    headers: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingTop: 10,
        alignSelf:"center",

      },
      SearchFieldContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        backgroundColor: Constants.backgroundtwo,
        borderRadius: 50,
        paddingLeft: 10,
        padding:Constants.padd,
        marginBottom:10,
      },
      SearchField: {
        width: "80%",
        marginLeft: 10,
      },
      VenuesTitle:{
          marginLeft:35,
          marginTop:10,
          fontSize:Constants.primaryHeading,
          fontWeight:Constants.Bold,
      }
});

export default Venues;