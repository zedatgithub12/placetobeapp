import React from 'react';
import {View, Text, StyleSheet,Image} from 'react-native';
import Constants from '../constants/Constants';
const FeaturedEvent = ({...props}) =>{
    return(
        <View style={styles.featuredEventList}>
        <Image
          source={props.imageURL}

          style={[styles.featuredEventImage,{ width: 180, height: 180 }]}
        />
      </View>
    )
}
const styles = StyleSheet.create({
    featuredEventList: {
        borderRadius: Constants.borderRad,
        margin:5,
      },
      featuredEventImage: {
        borderRadius: Constants.mediumbox,
      },
})
export default FeaturedEvent;