import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Signin from "./Signin";
import SignUp from "./Signup";

const Stack = createNativeStackNavigator();

const RootStackScreens =({ navigation })=>(
    <NavigationContainer>
             <Stack.Navigator headerMode='none'>
                 <Stack.Screen name="SignIn" component={Signin} options={{headerShown: false}}/>
                 <Stack.Screen name="SignUp" component = {SignUp}/>
             </Stack.Navigator>
    </NavigationContainer>
);
export default RootStackScreens;