import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Constants from '../constants/Constants';

const EventMap =()=>{ 

        return(
           
          <MapView
          // mapview for each event which is added to p2b-app database
          // this is mapview which is shown under each event 
          region={{
            latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
          }}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          minZoomLevel="12"
          showsUserLocation={true}
          onPress={() => alert("map is pressed")}
        >
          <Marker
            coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
            }}
            pinColor={Constants.red}
          />
        </MapView>
        )
    

}
const styles = StyleSheet.create({
    map: {
        width: "90%",
        height: "80%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginBottom: 20,
      },
})
export default EventMap;