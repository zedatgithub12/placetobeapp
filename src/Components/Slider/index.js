//import liraries
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import Connection from "../../constants/connection";

// slider a component
const Slider = () => {
  var placeHoldersImage = "placeholder.png";

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
          if (response.success) {
            var featuredImages = response.data;

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
        {Images.map((Ads, index) => (
          <Pressable key={index} style={styles.box} onPress={()=> alert(Ads.id)}>
            <Image
              source={{ uri: Connection.url + Connection.assets + Ads.image }}
              style={styles.image}
            />
          </Pressable>
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 5,
  },

  box: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginVertical: 2,
  },
  image: {
    width: "92%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#fff",
    resizeMode: "contain",
  },

  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 9,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f3f3f3",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#e29000",
  },
});
//make this component available to the app
export default Slider;
