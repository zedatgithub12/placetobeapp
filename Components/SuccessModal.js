import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";

import Constants from "../constants/Constants";

const SuccessModal = ({ visible, children, navigation }) => {


  return (
    <Modal transparent visible={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image
            style={[styles.successImage, { width: 80, height: 80 }]}
            source={require("../src/success.webp")}
          />
          <Text style={styles.ModalText}>Successfully Registered</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelbtn}>
              <Text style={styles.btntext}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=> navigation.navigate("SignIn")}
            style={styles.modalbtn}>
              <Text style={styles.btntext}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
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
  buttons:{

flexDirection:"row",

  },
  cancelbtn: {
    bottom: -15,
    backgroundColor: Constants.backgroundtwo,
    padding: Constants.paddTwo,
    borderRadius: Constants.mediumbox,
    margin: 10,
    marginTop: Constants.marginHead,
    width: "40%",
  },
  modalbtn: {
    bottom: -15,
    backgroundColor: Constants.primary,
    padding: Constants.paddTwo,
    borderRadius: Constants.mediumbox,
    margin: 10,
    marginTop: Constants.marginHead,
    width: "40%",
  },
  btntext: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    textAlign: "center",
  },
});
export default SuccessModal;
