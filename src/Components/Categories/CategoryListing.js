//import liraries
import React from "react";
import { Pressable } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

// category listing component

const Categories = ({
  category,
  icon,
  background,
  color,
  textColor,
  border,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          borderColor: border,
          elevation: 1,
          backgroundColor: background,
          padding: 6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon && <MaterialCommunityIcons name={icon} size={22} color={color} />}
      </View>

      <Text style={[styles.categoryText, { color: textColor }]}>
        {category}
      </Text>
    </Pressable>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 5,
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  categoryText: {},
});

//make this component available to the app
export default Categories;
