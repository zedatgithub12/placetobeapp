//import liraries
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import Connection from "../../constants/connection";

// slider a component
const Slider = () => {
  var placeHoldersImage = "placeholders.jpg";

  const PlaceholderImages = [
    {
      id: "1",
      image: placeHoldersImage,
    },
    {
      id: "2",
      image: placeHoldersImage,
    },
    {
      id: "3",
      image: placeHoldersImage,
    },
    {
      id: "4",
      image: placeHoldersImage,
    },
    {
      id: "5",
      image: placeHoldersImage,
    },
    {
      id: "6",
      image: placeHoldersImage,
    },
    {
      id: "7",
      image: placeHoldersImage,
    },
    {
      id: "8",
      image: placeHoldersImage,
    },
  ];
  // state of featured image
  const [Images, setImage] = useState(PlaceholderImages);
  //a function which featches featured-image on the top of home screen from database
  // then the function will be called on the component mounting
  useEffect(() => {
    const featchImage = () => {
      var ApiUrl = Connection.url + Connection.Images;
      var headers = {
        Accept: "application/json",
        "Content-Type": "appliction/json",
      };

      fetch(ApiUrl, {
        method: "post",
        headers: headers,
      })
        .then((response) => response.json())
        .then((response) => {
          var message = response[0].message;

          if (message === "succeed") {
            var featuredImages = response[0].images;

            setImage(featuredImages);
          } else {
            setImage(Images);
          }
        })
        .catch(() => {
          setImage(Images);
        });
    };
    featchImage();
    return () => {};
  }, []);

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
    marginHorizontal: 10,
  },

  box: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    height: 110,
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
