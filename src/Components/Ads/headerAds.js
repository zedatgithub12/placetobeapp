//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../themes/typography";

// header ads component
const HeaderAds = ({ showAds, Ad, PositiveAction, CloseAds }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.EventContainer, { backgroundColor: theme.primary.light }]}
    >
      <View style={styles.ImageContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1541270941907-3f7143c8c7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHxYMmQ4cm41ZktUc3x8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60",
          }}
          style={styles.FeaturedImagestyle}
        />
      </View>

      <View style={styles.ContainerTwo}>
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
          You can't rush the moment
        </Text>

        <View>
          <Text
            style={{
              padding: 4,
              fontFamily: Typography.family,
              fontSize: Typography.size.headingthree,
              fontWeight: Typography.weight.medium,
              lineHeight: 20,
              color: theme.dark[600],
            }}
          >
            Cards are a great way to display information
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={PositiveAction}>
              <Text
                style={{
                  padding: 4,
                  fontFamily: Typography.family,
                  fontSize: Typography.size.headingthree,
                  fontWeight: Typography.weight.bold,
                  lineHeight: 20,
                  color: theme.buttons.main,
                }}
              >
                Learn more
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
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
