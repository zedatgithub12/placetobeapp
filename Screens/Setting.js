import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Constants from "../constants/Constants";
import {Ionicons,MaterialCommunityIcons,FontAwesome,AntDesign} from 'react-native-vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
function Setting({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.settingtitle}>Preferences</Text>

      <TouchableOpacity
        style={styles.Settings}
        onPress={() => alert("themes")}
      >
        <View style={styles.iconbackground}>
          <MaterialCommunityIcons name="palette-swatch-outline" size={25} />
        </View>
        <Text style={styles.settingtxt}>Themes</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.Settings}
        onPress={() => alert("Amharic, English")}
      >
        <View style={styles.iconbackground}>
          <FontAwesome name="language" size={25} />
        </View>
        <Text style={styles.settingtxt}>Languages</Text>
      </TouchableOpacity>

      <Text style={styles.settingtitle}>Community Standards & Legal Policies</Text>

      <TouchableOpacity
        style={styles.Settings}
      >
        <View style={styles.iconbackground}>
          <Ionicons name="newspaper-outline" size={25} />
        </View>
        <Text style={styles.settingtxt}>Terms of use</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Settings}
      
      >
        <View style={styles.iconbackground}>
          <MaterialCommunityIcons name="security" size={25} />
        </View>
        <Text style={styles.settingtxt}>Privacy Policies</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Settings} >
        <View style={styles.iconbackground}>
          <MaterialCommunityIcons name="check-decagram-outline" size={25} />
        </View>
        <Text style={styles.settingtxt}>Community Standards</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Settings} >
        <View style={styles.iconbackground}>
          <MaterialCommunityIcons name="information-variant" size={25} />
        </View>
        <Text style={styles.settingtxt}>About</Text>
      </TouchableOpacity>

      <Text style={styles.settingtitle}>Help </Text>

      <TouchableOpacity
        style={styles.Settings} >
        <View style={styles.iconbackground}>
          <MaterialCommunityIcons name="message-text-outline" size={25} />
        </View>
        <Text style={styles.settingtxt}>P2B-Ethiopia FAQ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Settings} >
        <View style={styles.iconbackground}>
          <AntDesign name="question" size={25} />
        </View>
        <Text style={styles.settingtxt}>Ask Question</Text>
      </TouchableOpacity>
 
      <TouchableOpacity
        style={styles.Settings} >
        <View style={styles.iconbackground}>
          <AntDesign name="staro" size={25} />
        </View>
        <Text style={styles.settingtxt}>Rate Us</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:12,
    marginLeft:10,
  },
  iconbackground: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
    padding: Constants.padd,
    borderRadius: 14,
  },
  Settings: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    marginLeft: 20,
  },
  settingtxt: {
    justifyContent: "center",
    fontSize: Constants.headingtwo,
    marginLeft: 15,
    fontWeight: Constants.Boldtwo,
  },
  settingtitle: {
    justifyContent: "center",
    fontSize: Constants.headingone,
    marginLeft: 15,
    fontWeight: Constants.Bold,
    marginBottom:4,
    
  },
});

export default Setting;
