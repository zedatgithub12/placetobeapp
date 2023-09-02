//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import Constants from "../../constants/Constants";
import { Ionicons } from "react-native-vector-icons";
import { Dimensions } from "react-native";
import { Badge } from "react-native-paper";
import { useTheme } from "@react-navigation/native";

//  notice listing component
const Notice = ({
  type,
  iconColor,
  noticeTitle,
  about,
  time,
  status,
  onPressNotice,
}) => {
  var icon = type === "event" ? "calendar-outline" : "notifications-outline";
  const { theme } = useTheme();
  return (
    <TouchableNativeFeedback
      onPress={onPressNotice}
      style={styles.containerBtn}
    >
      <View
        style={[
          styles.noticeContainer,
          {
            display: "flex",
            alignItems: "center",
            backgroundColor:
              status === "seen"
                ? theme.background.main
                : Constants.transparentPrimary,
          },
        ]}
      >
        <View style={styles.notbellContainer}>
          {status === null && (
            <Badge
              size={10}
              style={{
                backgroundColor: theme.primary[600],
                position: "absolute",
                top: 2,
                right: 1,
              }}
            />
          )}
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>

        <View style={styles.contentContainer}>
          <Text numberOfLines={1} style={styles.noticeTitle}>
            {noticeTitle}
          </Text>

          <Text numberOfLines={1} style={styles.contents}>
            {about}
          </Text>

          <Text numberOfLines={1} style={styles.noticeTimestamp}>
            {time}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  containerBtn: {
    borderRadius: Constants.tiny,
    padding: 6,
  },
  noticeContainer: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 1,
    borderRadius: Constants.tinybox,
    backgroundColor: Constants.background,
  },
  notbellContainer: {
    width: 40,
    height: 40,
    marginTop: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.Faded,
    borderRadius: 50,
  },
  contentContainer: {
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: "row",
  },
  noticeTitle: {
    width: Dimensions.get("screen").width / 1.3,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    margin: 2,
  },
  contents: {
    width: Dimensions.get("screen").width / 1.3,
    margin: 2,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.textSize,
    color: Constants.Inverse,
  },
  noticeTimestamp: {
    margin: 3,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.textSize,
    color: Constants.Inverse,
    fontStyle: "italic",
  },
  helperInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  noticeStatus: {
    color: Constants.lightPurple,
    fontWeight: Constants.Bold,
    fontStyle: "italic",
    backgroundColor: Constants.Faded,
    height: "45%",
    paddingHorizontal: 10,
    borderRadius: Constants.borderRad,
  },
});

//make this component available to the app
export default Notice;
