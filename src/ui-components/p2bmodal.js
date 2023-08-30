//import liraries
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Typography } from "../themes/typography";
import Constants from "../constants/Constants";
import { ScrollView } from "react-native";

// Place to be Ethiopia modal component
const P2bModal = ({ visible, toggleModal, title, children }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={toggleModal}
      style={styles.bottomsheetcontainer}
    >
      <Animatable.View
        animation="slideInUp"
        duration={0.5}
        style={[
          styles.bottomsheet,
          {
            minHeight: Dimensions.get("screen").width,
          },
        ]}
      >
        <View style={styles.sheetHeader}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <MaterialCommunityIcons
              name="bell-badge"
              size={24}
              color={Constants.primary}
            />
            <Text
              style={{
                marginLeft: 8,
                fontSize: Typography.size.headingone,
                fontWeight: Typography.weight.bold,
                width: "82%",
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
          </View>

          <TouchableOpacity style={styles.closebtn} onPress={toggleModal}>
            <MaterialCommunityIcons
              name="close"
              size={22}
              color={Constants.Inverse}
            />
          </TouchableOpacity>
        </View>

        <ScrollView>{children}</ScrollView>
      </Animatable.View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  bottomsheetcontainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomsheet: {
    backgroundColor: Constants.Faded,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopLeftRadius: 14,
    borderTopEndRadius: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 4,
    marginBottom: 8,
  },
  closebtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 18,
  },
});

//make this component available to the app
export default P2bModal;
