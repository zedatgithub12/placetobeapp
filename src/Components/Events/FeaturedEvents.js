import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Constants from "../../constants/Constants";
import { MaterialIcons } from "react-native-vector-icons";
import Connection from "../../constants/connection";

const FeaturedEvent = ({ title, picture, organizer,onPress }) => {
  const featuredImageUri = Connection.url + Connection.assets;
  return (
    <Pressable 
    onPress={onPress}
    style={styles.featuredEventList}>
      <View style={{flexDirection:"row",}}>
      <Image
        source={{uri: featuredImageUri + picture}}
        style={[styles.featuredEventImage, { width: 50, height: 50, borderRadius: 5, borderWidth:1, }]}
        resizeMode="contain"
      />
      <View >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.organizer}>{organizer}</Text>
      </View>

      </View>
      <MaterialIcons
        name="keyboard-arrow-right"
        size={20}
        color={Constants.Secondary}
      />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  featuredEventList: {
    width:"96%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf:"center",
    justifyContent: "space-between",
    backgroundColor: Constants.background,
    borderRadius: 3,
    margin: 2,
    padding:3,

  },
  featuredEventImage: {
    borderRadius: Constants.mediumbox,
    marginRight:12,
  },
  title:{
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight:Constants.Bold
  },
  organizer:{
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight:Constants.Boldtwo,
    color:Constants.Inverse
  }
});
export default FeaturedEvent;
