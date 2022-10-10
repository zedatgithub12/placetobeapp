import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from './ProfileScreen';

const P2bScreens =({navigation}) =>{
    const Stack = createNativeStackNavigator();
    return(
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    )
}
export default P2bScreens;