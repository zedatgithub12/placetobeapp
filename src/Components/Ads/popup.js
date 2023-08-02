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
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Typography } from "../../themes/typography";
import * as Animatable from "react-native-animatable";

// create a pop up modal
const PopupAds = ({ showModal, ad, positiveAction }) => {
  const [modalVisible, setModalVisible] = useState(showModal);
  const { theme } = useTheme();

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setModalVisible(!modalVisible)}
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
            onPress={() => setModalVisible(!modalVisible)}
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
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1541270941907-3f7143c8c7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHxYMmQ4cm41ZktUc3x8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60",
            }}
            style={{
              width: Dimensions.get("screen").width / 1.2,
              height: 160,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
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
                  fontSize: Typography.size.headingone,
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
                  fontWeight: Typography.weight.regular,
                  lineHeight: 20,
                  color: theme.dark[800],
                },
              ]}
            >
              Cards are a great way to display information, usually containing
              content
            </Text>

            <Pressable
              onPress={positiveAction}
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
                Learn more
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
