//import liraries
import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Typography } from "../../../themes/typography";

// header of events segmentation made in the homepage
const TitleContainer = ({ title }) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.primary.main,
        marginTop: 10,
        marginHorizontal: 5,
        paddingVertical: 2,
        borderTopEndRadius: 8,
        borderTopLeftRadius: 8,
      }}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.dark.main,
            fontSize: Typography.size.headingtwo,
            fontWeight: Typography.weight.medium,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  title: {
    marginLeft: 10,
    marginTop: 6,
    marginBottom: 2,
  },
});

//make this component available to the app
export default TitleContainer;
