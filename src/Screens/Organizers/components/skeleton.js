//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

// create a component
const OrganizerSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder>
        <View style={{ width: "100%", height: 120 }} />

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginTop: -50,
            }}
          />
          <View
            style={{ width: 200, height: 20, borderRadius: 6, marginTop: 6 }}
          />
          <View
            style={{ width: 160, height: 14, borderRadius: 5, marginTop: 8 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 20 }} />
          <View
            style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 46 }}
          />
          <View
            style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 46 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 28,
          }}
        >
          <View style={{ width: 120, height: 40, borderRadius: 4 }} />
          <View
            style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 16 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 34,
          }}
        >
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
          <View
            style={{ width: 120, height: 135, borderRadius: 4, marginLeft: 4 }}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});

//make this component available to the app
export default OrganizerSkeleton;
