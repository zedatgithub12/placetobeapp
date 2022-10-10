import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "../constants/Constants";
import {
  FontAwesome5,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { Divider, Title } from "react-native-paper";
const VenuePotential = ({ ...props }) => {
  return (
    <View
      // audience handling potential of venues main container
      style={styles.venuePotential}
    >
      <View style={styles.VenueName}>
        <Title style={styles.venueNameTxt}>{props.name}</Title>
      </View>
      <Divider />

      <View
        //second container which contains the service which is prvided by venue
        style={styles.secondContainer}
      >
        <View
          // venue roomPrice container
          style={styles.roomPrice}
        >
          <FontAwesome5
            name="money-check"
            size={18}
            style={styles.Icons}
            color={Constants.primary}
          />
          <Text style={styles.textDesc}>{props.RoomPrice}</Text>
        </View>

        <View
          // parkingSlot service container
          style={styles.parkingStyle}
        >
          <MaterialCommunityIcons
            name="car-multiple"
            size={22}
            style={styles.Icons}
            color={Constants.primary}
          />
          <Text style={styles.textDesc}>{props.Slots}</Text>
        </View>

        <View
          // venue room count container
          style={styles.rooms}
        >
          <MaterialCommunityIcons
            name="key-chain"
            size={22}
            style={styles.Icons}
            color={Constants.primary}
          />
          <Text style={styles.textDesc}>{props.RoomKeys}</Text>
        </View>

        <View
          // venue location container
          style={styles.location}
        >
          <MaterialCommunityIcons
            name="directions"
            size={22}
            style={styles.Icons}
            color={Constants.background}
          />
          <Text style={styles.textDesc}>Navigate</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  venuePotential: {
    width: "85%",
    alignSelf: "center",
    backgroundColor: Constants.background,
    marginTop: -49,
    borderRadius: Constants.borderRad,
    padding: Constants.paddTwo,
    elevation: 4,
    shadowColor: Constants.mainTwo,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    padding: 5,
  },
VenueName:{
  padding:5,
  paddingHorizontal: 15,
  color:Constants.Inverse,

},
  secondContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
  },
  parkingStyle: {
    width: "18%",

    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  rooms: {
    width: "18%",

    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  roomPrice: {
    width: "18%",
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  location: {
    width: "31%",
    backgroundColor: Constants.primary,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  textDesc: {
    color: Constants.mainTwo,
    fontSize: Constants.thirty,
    fontWeight: Constants.Boldtwo,
  },
});
export default VenuePotential;
