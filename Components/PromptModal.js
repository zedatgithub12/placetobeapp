import React, { Component } from "react";
import { View,Modal, StyleSheet } from "react-native";
import { HelperText, Title } from "react-native-paper";
import Constants from "../constants/Constants";
import * as Animatable from 'react-native-animatable';

function PromptModal({ visible, children, navigation }) {
  const [showModal, setShowModal] = React.useState(visible);

  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Constants.background,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  ModalText: {
    fontSize: Constants.headingone,
    margin: 10,
  },
  buttons: {
    flexDirection: "row",
  },
 
  modalbtn: {
    bottom: -15,
    backgroundColor: Constants.primary,
    padding: Constants.paddTwo,
    borderRadius: Constants.mediumbox,
    margin: 10,
    marginTop: Constants.marginHead,
    width: "45%",
  },
  btntext: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    textAlign: "center",
  },
  closeModal:{
    position:"absolute",
    right:15,
    top:10,
  },
  mainErrorIndicator:{
    marginTop:15,
    flexDirection: "row",
    alignSelf: "center",
 
  }
})


export default PromptModal;
