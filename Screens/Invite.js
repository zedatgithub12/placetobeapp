import React from 'react';
import { View,StyleSheet, Text } from 'react-native';
import Constants from "../constants/Constants";

function Invite({ navigation }){
    return(
        <View style={styles.container}>
          <Text>Invite Friends</Text>
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems: 'center',
    
    }
});

export default Invite;