import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Typography } from "../../themes/typography";
import Connection from "../../api";
import { UserInteraction } from "../../Utils/Ads";

// create a native ads component to be shown inside homescreen
const NativeAdsOne = ({ ad, hideCard }) => {
  const Ad = ad ? ad[0] : [];
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

      <View style={styles.container}>
        <TouchableOpacity
          onPress={hideCard}
          style={[
            styles.closeButton,
            {
              height: 32,
              width: 32,
              padding: 3,
              zIndex: 2,
            },
          ]}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              alignSelf: "center",
              zIndex: 1,
              backgroundColor: theme.background.faded,
              borderRadius: 13,
              padding: 3,
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={20}
              style={{ color: "#555", zIndex: 2 }}
            />
          </View>
        </TouchableOpacity>

        <Image
          source={{
            uri: featuredImageUri + Ad.ad_creative,
          }}
          style={{
            width: Dimensions.get("screen").width / 1.1,
            height: 160,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />

        <View
          style={[
            styles.bodyContent,
            { backgroundColor: theme.background.main },
          ]}
        >
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
            <Text
              style={[
                styles.content,
                {
                  padding: 4,
                  fontFamily: Typography.family,
                  fontSize: Typography.size.headingthree,
                  fontWeight: Typography.weight.medium,
                  lineHeight: 20,
                  color: theme.dark[600],
                },
              ]}
            >
              {Ad.ad_description}
            </Text>
          </Pressable>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Pressable
              onPress={() => handleUserAction("conversion")}
              style={{ margin: 8, marginLeft: 4, justifyContent: "flex-end" }}
            >
              <Text
                style={{
                  padding: 4,
                  paddingLeft: 0,
                  fontFamily: Typography.family,
                  fontSize: Typography.size.headingthree,
                  fontWeight: Typography.weight.bold,
                  lineHeight: 20,
                  color: theme.buttons.main,
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
      </View>
   
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width / 1.1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "relative",
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 2,
    bottom: 2,
    padding: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  bodyContent: {
    width: "100%",
    padding: 6,
    paddingHorizontal: 8,
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
  },
});

//make this component available to the app
export default NativeAdsOne;
