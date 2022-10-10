import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Venue from "../assets/VenueData";
import DropDown from "../Components/Dropdown";
import Venues from "../Components/Venues";
import Constants from "../constants/Constants";

const VenueListing = ({ navigation }) => {


 

  const renderItem = ({ item }) => (
    <Venues
      FeaturedImage={item.FeaturedImage}
      title={item.title}
      Category={item.Category}
      Rating={item.Rating}
      location={item.location}
      parkingSlot={item.parkingSlot}
      numberOfRoom={item.numberOfRoom}
      roomPrice={item.roomPrice}
      description={item.description}
      onPress={() => navigation.navigate("VenueDetail", {item})}
    />
  );
  return (
    <View style={styles.venueContainer}>
     <DropDown />
      <FlatList
        // List of events in extracted from database in the form JSON data
        data={Venue}
        renderItem={renderItem}
        key={"_"}
        keyExtractor={(item) => item.id}
   
        numColumns={2}
        style={styles.venueFlatlist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  venueContainer:{
    flex:1,
    backgroundColor: Constants.background,
  },
  venueFlatlist: {
    paddingHorizontal: 10,
    backgroundColor: Constants.background,

  },
 

});
export default VenueListing;
