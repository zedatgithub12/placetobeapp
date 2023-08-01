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
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Typography } from "../../themes/typography";
import * as Animatable from "react-native-animatable";

// create a native ads component to be shown inside homescreen
const NativeAdsOne = ({ showAds, Ad, PositiveAction, CloseAds }) => {
  const [showAd, setShowAd] = useState(showAds);
  const { theme } = useTheme();
  return (
    <Pressable onPress={PositiveAction}>
      <View style={styles.container}>
        <View
          style={{
            width: Dimensions.get("screen").width / 1.1,
            height: Dimensions.get("screen").height / 2.2,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAd(!showAd)}
              style={[
                styles.closeButton,
                { backgroundColor: theme.background.faded },
              ]}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                style={{ zIndex: 1001 }}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1541270941907-3f7143c8c7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHxYMmQ4cm41ZktUc3x8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60",
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
              Cards are a great way to display information, usually containing
              content
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                onPress={PositiveAction}
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
    </Pressable>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 0,
    bottom: 2,
    padding: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  bodyContent: {
    padding: 6,
    paddingHorizontal: 8,
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
  },
});

//make this component available to the app
export default NativeAdsOne;
