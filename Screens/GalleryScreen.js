import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../constants/Constants";
import Images from "../Components/Gallery";
import Pictures from "../src/Pictures";
import { Caption } from "react-native-paper";

const Gallery = ({ navigation }) => {
  const [selectedId, setSelectedId] = React.useState(null);

  const renderItem = ({ item }) => (
    <Images
      picture={item.picture}
      onPress={() => navigation.navigate("GalleryDetail", { item })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headertxtcontainer}>
      
        <View style={styles.gallerytxtContainer}>
          <Text style={styles.galleryTittle}>Place to be Gallery</Text>
          <Text style={styles.helperTxt}>Best places to visit in Ethiopia</Text>
        </View>
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../assets/galleryImage.png")}
            resizeMode="cover"
            style={styles.illustration}
          />
        </View>
      </View>

      <FlatList
        //gallery Flatlist
        style={styles.galleryFlatList}
        key={"_"}
        data={Pictures}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        numColumns={3}
        refreshing={true}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: Constants.background,
  },
  headertxtcontainer: {
    flexDirection: "row",
  alignItems:"center",
    justifyContent:"space-around",
    paddingBottom: 4,
    marginLeft: 15,
    marginTop: 10,
  },
  illustrationContainer: {
    width: "30%",
    height: 80,
  },
  illustration: {
    width: "100%",
    height: "100%",
    
  },
  gallerytxtContainer:{
  width:'70%'
  },
  galleryTittle: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    width: "100%",
    
  },
  helperTxt:{
    color:Constants.grey,
     fontFamily:Constants.fontFam,
  }
});

export default Gallery;
