import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Constants from '../../constants/Constants';
import {MaterialIcons} from 'react-native-vector-icons';

const FilterCategory =({...props})=>{
    return(
        <View style={styles.categoryContainer}>
            <MaterialIcons name={props.IconName} size={20} color={Constants.primary} style={[styles.CatIcon]}/>
            <Text style={styles.catName}>{props.CategoryName}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    categoryContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        padding:8,
        backgroundColor: Constants.background,
        borderRadius: Constants.mediumbox,
        margin:5,
    },
    CatIcon:{
        marginRight:5
    },
    catName: {
        fontWeight: Constants.Bold
    }

});

export default  FilterCategory;