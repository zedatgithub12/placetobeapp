//import liraries
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Constants from '../constants/Constants';
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Caption } from 'react-native-paper';


// create a component
const Slider = ({image, title, description,icon, extraTitle}) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={{url: image}} style={styles.backgroundImage} resizeMode="cover">
               <Text style={styles.extraTitle}>{extraTitle}</Text>
                <Text style={styles.PrimaryTitleText}>{title}</Text>
                <Caption style={{color: Constants.background}}>{description}</Caption>
                 <MaterialCommunityIcons name={icon} color={Constants.background} size={24}/>
            </ImageBackground>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    PrimaryTitleText: {
        fontSize: Constants.headingone,
        fontWeight: Constants.Bold,
        color: Constants.background
      },
      extraTitle:{
        fontSize: Constants.headingthree,
        fontWeight: Constants.Bold,
        color: Constants.background
      }
});

//make this component available to the app
export default Slider;
