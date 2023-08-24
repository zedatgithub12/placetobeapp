//import liraries
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  Linking,
} from "react-native";
import Connection from "../../constants/connection";
import { UserInteraction } from "../../Utils/Ads";

// slider a component
const Slider = ({ ad }) => {
  const Banners = ad;
  const featuredImageUri = Connection.url + Connection.assets;

  const handleUserAction = (reaction, banner) => {
    if (reaction === "clicked") {
      Linking.openURL(banner.ad_link_url);
      UserInteraction(banner, reaction);
    } else {
      UserInteraction(banner, reaction);
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % Banners.length;
      setCurrentImageIndex(nextIndex);
      scrollViewRef.current.scrollTo({
        x: nextIndex * Dimensions.get("screen").width,
        animated: true,
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
        {Banners.map((banner, index) => (
          <Pressable
            key={index}
            style={styles.box}
            onPress={() => handleUserAction("clicked", banner)}
          >
            <Image
              source={{ uri: featuredImageUri + banner.ad_creative }}
              style={styles.image}
            />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {Banners.map((_, index) => (
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
    bottom: 5,
    padding: 10,
    paddingBottom: 2,
  },
  paginationDot: {
    width: 7,
    height: 7,
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
