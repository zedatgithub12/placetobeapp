import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "../constants/Constants";
import { EvilIcons } from "react-native-vector-icons";

const Sevices = ({ ...props }) => {
  return (
    <View
      //a services give at the venue
      style={styles.serviceContainers}
    >
      <Text style={styles.servicesTitle}>Services</Text>
      <View style={styles.servicesList}>
        <EvilIcons name="check" size={22} />
        <Text>Accomodation</Text>

      </View>
      <View style={styles.servicesList}>
      <EvilIcons name="check" size={22} />
        <Text>Catering</Text>
      </View>
      <View style={styles.servicesList}>
      <EvilIcons name="check" size={22} />
        <Text>Party Planner</Text>
      </View>
      <View style={styles.servicesList}>
      <EvilIcons name="check" size={22} />
        <Text>Gymnazym</Text>
      </View>


      
    </View>
  );
};
const styles = StyleSheet.create({
    serviceContainers: {
        margin: 10,
        marginTop: 5,
        paddingHorizontal: 15,
      },
      servicesTitle: {
        fontSize: Constants.headingone,
        fontWeight: Constants.Bold,
      },
      servicesList:{
        flexDirection:"row",
        margin:5,
        marginLeft: 15,
        alignItems:"center"
      }
})

export default Sevices;