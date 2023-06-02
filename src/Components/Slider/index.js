//import liraries
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import Connection from "../../constants/connection";

// slider a component
const Slider = ({ Images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % Images.length;
      setCurrentImageIndex(nextIndex);
      scrollViewRef.current.scrollTo({
        x: nextIndex * Dimensions.get("screen").width,
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / Dimensions.get("screen").width
          );
          setCurrentImageIndex(index);
        }}
      >
        {Images.map((image, index) => (
          <View key={index} style={styles.box}>
            <Image
              source={{ uri: Connection.url + Connection.assets + image.image }}
              style={styles.image}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {Images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentImageIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    margin: 10,
    marginHorizontal: 0,
  },

  box: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 12,
   
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#eee",
    resizeMode: "contain",
  },

  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
  },
  paginationDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#ffbb00",
  },
});
//make this component available to the app
export default Slider;
