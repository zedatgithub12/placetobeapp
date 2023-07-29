//import liraries
import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";

// create a component
const PopupAds = ({ showModal }) => {
  return (
    <View style={styles.container}>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View>
          <Text>This is the modal content!</Text>
        </View>
      </Modal>
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
});

//make this component available to the app
export default PopupAds;
