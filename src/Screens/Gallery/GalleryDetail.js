import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Paragraph, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Constants from "../../constants/Constants";

const GallerDetail = ({ route, navigation }) => {
  const { item } = route.params;
  return (
    <SafeAreaView style={{flex:1, backgroundColor:Constants.background}}>
      <ScrollView >
        <View style={styles.featuredImageContainer}>
          <TouchableOpacity
            style={styles.backArrow} // back arrow button style
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={25}
              //back arrow icon
            />
          </TouchableOpacity>
          <Image
            //Featured Image of the gallery Image
            source={item.picture} //featured image source
            resizeMode="cover"
            style={styles.image} //featured image styles
          />
        </View>
        <View style={styles.placeName}>
          <Title style={styles.name} numberOfLines={2}>{item.title}</Title>
          <Text style={styles.placeLocation}> <MaterialCommunityIcons
              name="map-marker-radius"
              size={15}
              style={styles.eventIcons}
            />{item.location}</Text>
        </View>
        <View
          // Venue Description Container
          style={styles.placeDescription}
        >
          
          <Paragraph style={styles.venueDesctxt}>
            {item.description}
          </Paragraph>
   
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Featurd Image style
  image: {
    flex: 1,
    width: "100%",
    height: 350,

    borderWidth: 2,
    borderRadius: 20,
  },
  //featured Image Container Styling
  featuredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "96%",
    height: "90%",
  },
  backArrow: {
    position: "absolute",
    top: 5,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: Constants.background,
    height: "11%",
    width: "11%",
    borderRadius: 50,
    elevation: 2,
  },
  placeName: {
    width: "85%",
    alignSelf: "center",
    backgroundColor: Constants.background,
    marginTop: -30,
    borderRadius: Constants.borderRad,
    padding: Constants.paddTwo,
    elevation: 2,
    shadowColor: Constants.mainTwo,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    padding: 5,
  },
  name:{
    paddingHorizontal: 15,
    color:Constants.Inverse,
  },
  descTitle: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
  },
  placeDescription: {
    margin: 10,
    marginTop: 15,
    paddingHorizontal: 15,
  },
  venueDesctxt: {
    marginTop: 6,
    fontSize: Constants.thirty,
    fontFamily: "Roboto",
    fontWeight: Constants.Boldtwo,
    color: Constants.mainTwo,
    marginLeft: 7,
  },
  placeLocation:{
        fontSize: Constants.thirty,
        fontWeight: Constants.Boldtwo,
        color: Constants.primary,
        marginLeft:10,
       
        
  }
});
export default GallerDetail;
