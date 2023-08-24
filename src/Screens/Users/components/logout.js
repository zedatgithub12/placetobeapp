import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import Modal from "react-native-modal";
import Constants from "../../../constants/Constants";
import { Caption } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../../themes/typography";

const LogoutDialog = ({ visible, onCancel, onLogout }) => {
  const { theme } = useTheme();
  return (
    <Modal isVisible={visible}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          alignSelf: "center",
          backgroundColor: theme.background.main,
          borderRadius: 8,
          width: Dimensions.get("screen").width / 1.2,
          paddingVertical: 30,
        }}
      >
        <Text style={styles.sheetTitle}>Are you sure you want to logout?</Text>

        <View style={styles.actionBtn}>
          <Pressable style={styles.Cancelbtn} onPress={onCancel}>
            <Text>Cancel</Text>
          </Pressable>

          <Pressable style={styles.YesBtn} onPress={onLogout}>
            <Text
              style={{
                fontFamily: Typography.family,
                fontSize: Typography.size.headingthree,
                fontWeight: Typography.weight.black,
                color: theme.danger.main,
              }}
            >
              Yes
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  dialogContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },

  sheetTitle: {
    color: Constants.Inverse,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
  },

  signInBtn: {
    borderRadius: Constants.tiny,
    padding: Constants.padd,
    paddingHorizontal: 20,
    margin: 10,
  },
  actionBtn: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40,
    marginBottm: 10,
    background: "red",
  },
  Cancelbtn: {
    padding: 6,
    paddingHorizontal: 20,
    borderRadius: Constants.tiny,
    fontWeight: Constants.Bold,
  },
  YesBtn: {
    width: "40%",
    padding: 6,
    paddingHorizontal: 20,
    borderRadius: Constants.tiny,
    alignItems: "center",
  },
};

export default LogoutDialog;
