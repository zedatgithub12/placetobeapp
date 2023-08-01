//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Typography } from "../../themes/typography";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as Animatable from "react-native-animatable";

// slideup ads component
const SlideUp = ({ slideUpPressed, onClose }) => {
  const { theme } = useTheme();
  return (
    <Pressable onPress={slideUpPressed} style={{ position: "relative" }}>
      <Animatable.View
        animation="slideInRight"
        style={[styles.container, { backgroundColor: theme.background.main }]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 4,
          }}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1541270941907-3f7143c8c7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHxYMmQ4cm41ZktUc3x8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60",
            }}
            style={{
              width: Dimensions.get("screen").width / 5,
              height: 59,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            }}
          />

          <View>
            <Text
              style={[
                styles.title,
                {
                  paddingHorizontal: 8,
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
                  paddingHorizontal: 8,
                  fontFamily: Typography.family,
                  fontSize: Typography.size.textSize,
                  fontWeight: Typography.weight.medium,

                  color: theme.dark.main,
                },
              ]}
              numberOfLines={1}
            >
              Cards are a great way to display information
            </Text>
            <Text
              style={{
                paddingHorizontal: 8,
                fontFamily: Typography.family,
                fontSize: Typography.size.headingthree,
                fontWeight: Typography.weight.medium,

                color: theme.buttons.main,
              }}
            >
              Learn more
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={[styles.closeButton]}>
          <MaterialCommunityIcons name="close" size={20} />
        </TouchableOpacity>
      </Animatable.View>
    </Pressable>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 52,
    marginHorizontal: 1,
    borderRadius: 6,
    zIndex: 0,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 2,
    padding: 9,
    paddingTop: 3,
  },
});

//make this component available to the app
export default SlideUp;
