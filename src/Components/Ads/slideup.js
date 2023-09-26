//import liraries
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Typography } from "../../themes/typography";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as Animatable from "react-native-animatable";
import Connection from "../../api";
import { UserInteraction } from "../../Utils/Ads";

// slideup ads component
const SlideUp = ({ onClose, ad }) => {
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
    ad && (
      <Pressable
        onPress={() => handleUserAction("clicked")}
        style={{ position: "relative" }}
      >
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
                uri: featuredImageUri + Ad.ad_creative,
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
                {Ad.ad_heading}
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
                {Ad.ad_description}
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
                {Ad.ad_button_label}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={onClose} style={[styles.closeButton]}>
            <MaterialCommunityIcons name="close" size={20} color="#444" />
          </TouchableOpacity>
        </Animatable.View>
      </Pressable>
    )
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
