//import liraries
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
} from "react-native";
import Constants from "../../constants/Constants";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../themes/typography";
import { UserInteraction } from "../../Utils/Ads";
import Connection from "../../api";

// header ads component
const HeaderAds = ({ ad, hideAd }) => {
  const Ad = ad[0] ? ad[0] : [];
  const { theme } = useTheme();
  const featuredImageUri = Connection.url + Connection.assets;

  const handleUserAction = (reaction) => {
    if (reaction === "conversion" || reaction === "clicked") {
      Linking.openURL(Ad.ad_link_url);
      UserInteraction(Ad, reaction);
    } else {
      UserInteraction(Ad, reaction);
    }
  };
  return (
    <Pressable
      onPress={() => handleUserAction("clicked")}
      style={[
        styles.EventContainer,
        {
          backgroundColor: theme.primary.light,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        },
      ]}
    >
      <View style={styles.ImageContainer}>
        <Image
          source={{
            uri: featuredImageUri + Ad.ad_creative,
          }}
          style={styles.FeaturedImagestyle}
        />
      </View>

      <View style={styles.ContainerTwo}>
        <Pressable onPress={() => handleUserAction("clicked")}>
          <Text
            style={[
              styles.title,
              {
                paddingHorizontal: 4,
                fontFamily: Typography.family,
                fontSize: Typography.size.headingtwo,
                fontWeight: Typography.weight.bold,
                color: theme.dark.main,
              },
            ]}
          >
            {Ad.ad_heading}
          </Text>
        </Pressable>
        <View
          style={{ flexDirection: "column", justifyContent: "space-between" }}
        >
          <Text
            style={{
              padding: 4,
              fontFamily: Typography.family,
              fontSize: Typography.size.headingthree,
              fontWeight: Typography.weight.medium,
              lineHeight: 16,
              color: theme.dark[600],
            }}
          >
            {Ad.ad_description}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            width: "100%",
            position: "absolute",
            bottom: 4,
            paddingHorizontal: 4,
          }}
        >
          <Pressable onPress={() => handleUserAction("conversion")}>
            <Text
              style={{
                fontFamily: Typography.family,
                fontSize: Typography.size.headingthree,
                fontWeight: Typography.weight.bold,
                lineHeight: 20,
                color: theme.buttons.main,
                marginLeft: 4,
                bottom: 0,
              }}
            >
              {Ad.ad_button_label}
            </Text>
          </Pressable>

          <Text
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              paddingHorizontal: 4,
              fontFamily: Typography.family,
              fontSize: Typography.size.textSize,
              fontWeight: Typography.weight.semiBold,
              color: theme.dark.main,
            }}
          >
            Ads
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

// define your styles
const styles = StyleSheet.create({
  EventContainer: {
    flexDirection: "row",
    width: "97%",
    marginTop: 4,
    alignSelf: "center",
    marginHorizontal: 12,
  },

  FeaturedImagestyle: {
    width: 106,
    height: 96,
    borderBottomLeftRadius: Constants.medium,
    borderTopLeftRadius: Constants.medium,
  },
  ContainerTwo: {
    width: "68%",
    padding: 4,
    paddingTop: 0,
    marginLeft: 5,
  },

  bodyContent: {
    padding: 6,
    paddingHorizontal: 8,
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
  },
});

//make this component available to the app
export default HeaderAds;
