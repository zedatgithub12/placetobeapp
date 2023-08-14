//import liraries
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Typography } from "../../themes/typography";
import * as Animatable from "react-native-animatable";
import { UserInteraction } from "../../Utils/Ads";
import Connection from "../../api";

// create a pop up modal
const PopupAds = ({ showModal, ad }) => {
  const Ad = ad[0];
  const [modalVisible, setModalVisible] = useState(showModal);
  const { theme } = useTheme();
  const featuredImageUri = Connection.url + Connection.assets;

  const handleUserAction = (reaction) => {
    if (reaction === "conversion" || reaction === "clicked") {
      Linking.openURL(Ad.ad_link_url);
      UserInteraction(Ad, reaction);
    } else {
      setModalVisible(false);
      UserInteraction(Ad, reaction);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => handleUserAction("closed")}
    >
      <Animatable.View style={styles.container} animation="bounceIn">
        <View
          style={{
            width: Dimensions.get("screen").width / 1.2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => handleUserAction("closed")}
            style={[
              styles.closeButton,
              { backgroundColor: theme.background.faded },
            ]}
          >
            <MaterialCommunityIcons name="close" size={20} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: Dimensions.get("screen").width / 1.2,
            height: Dimensions.get("screen").height / 2.2,
          }}
        >
          <Pressable onPress={() => handleUserAction("clicked")}>
            <Image
              source={{
                uri: featuredImageUri + Ad.ad_creative,
              }}
              style={{
                width: Dimensions.get("screen").width / 1.2,
                height: 160,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            />
          </Pressable>
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
                    fontSize: Typography.size.headingone,
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
                    fontWeight: Typography.weight.regular,
                    lineHeight: 20,
                    color: theme.dark[800],
                  },
                ]}
              >
                {Ad.ad_description}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleUserAction("conversion")}
              style={{ margin: 8, marginLeft: 4, justifyContent: "flex-end" }}
            >
              <Text
                style={{
                  padding: 4,
                  fontFamily: Typography.family,
                  fontSize: Typography.size.headingtwo,
                  fontWeight: Typography.weight.medium,
                  lineHeight: 20,
                  color: theme.buttons.main,
                }}
              >
                {Ad.ad_button_label}
              </Text>
            </Pressable>
          </View>
        </View>
      </Animatable.View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  closeButton: {
    position: "absolute",
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
export default PopupAds;
