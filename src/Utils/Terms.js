//import liraries
import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Typography } from "../themes/typography";

// Terms of agreement components a component
const Terms = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ padding: 3 }}
        onPress={() => Linking.openURL("https://placetobeethiopia.com/refunding-terms")}
      >
        <Text
          style={{
            fontWeight: Typography.weight.semiBold,
            fontSize: Typography.size.headingthree,
            color: theme.dark.main,
            marginRight: 4,
          }}
        >
          Refunding Terms
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontWeight: Typography.weight.semiBold,
          color: theme.dark.main,
          paddingHorizontal: 3,
        }}
      >
        |
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ padding: 3 }}
        onPress={() =>
          Linking.openURL("https://placetobeethiopia.com/terms-agreement")
        }
      >
        <Text
          style={{
            fontWeight: Typography.weight.semiBold,
            color: theme.dark[600],
            marginLeft: 4,
          }}
        >
          Terms of Agreement
        </Text>
      </TouchableOpacity>
    </View>
  );
};

//make this component available to the app
export default Terms;
