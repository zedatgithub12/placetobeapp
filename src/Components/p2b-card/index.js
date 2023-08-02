//import liraries
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Typography } from "../../themes/typography";
import { useTheme } from "@react-navigation/native";
import { Divider } from "react-native-paper";

// Place to be ethiopia card component
const PlacetobeCard = ({ title, children }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.firstcontent,
        {
          backgroundColor: theme.background.main,
          borderWidth: 0.2,
          borderColor: theme.dark[200],
          borderRadius: 2,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            textTransform: "capitalize",
            fontFamily: Typography.family,
            fontSize: Typography.size.headingtwo,
            fontWeight: Typography.weight.bold,
            marginBottom: 8,
          }}
        >
          {title}
        </Text>
      </View>
      <Divider height="2" />
      <View style={{ paddingHorizontal: 20, paddingVertical: 6 }}>
        {children}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  firstcontent: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
});

//make this component available to the app
export default PlacetobeCard;
