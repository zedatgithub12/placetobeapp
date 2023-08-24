//import liraries
import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

// create a component
const P2bMenu = ({ FirstChild, children, open }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.menuContainer}>
      {FirstChild}

      {open && (
        <ScrollView
          style={[styles.menuStyle, { backgroundColor: theme.background.main }]}
          contentContainerStyle={styles.contentContainer}
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  menuContainer: {
    position: "relative",
    minWidth: 160,
    borderRadius: 4,
    borderWidth: 0.3,
    zIndex: 2,
    overflow: "visible",
  },
  menuStyle: {
    position: "absolute",
    bottom: 42,
    left: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 160,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

//make this component available to the app
export default P2bMenu;
