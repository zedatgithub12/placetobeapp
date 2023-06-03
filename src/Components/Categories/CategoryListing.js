//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Constants from "../../constants/Constants";
import * as Animatable from "react-native-animatable";
// create a component
const Categories = ({ category, icon, color, onPress }) => {
  return (
    <TouchableNativeFeedback
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.iconContainer}
    >
      <View style={styles.container}>
        <Animatable.View
          animation="zoomIn"
          style={[
            styles.iconContainer,
            { backgroundColor: Constants.background, borderColor: color },
          ]}
        >
          <MaterialCommunityIcons name={icon} size={20} color={color} />
        </Animatable.View>
        <Text>
          {category.length < 11
            ? `${category}`
            : `${category.substring(0, 11)}...`}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    margin: 2,
  },
  iconContainer: {
    height: 40,
    width: 40,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 0.5,
  },
});

//make this component available to the app
export default Categories;
