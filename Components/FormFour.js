import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import { HelperText } from "react-native-paper";
import Constants from "../constants/Constants";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { AuthContext } from "./context";

const FormFour = () => {
  // a useContent hook which will treat all input value as global variables
  // the eventproperties variable is declared inside App mathod bacause we need to keep all gloabal varibales in top tree
  // value collect from input field will be access inside Submit event class found in Screens folder
  // while submitting event it will validate the value stored in glabal scope

  const { formFour } = React.useContext(AuthContext);

  const FormFourFields = (
    eventLocationLatitude,
    eventLocationLongtude,
    eventContactPhone,
    eventLink
  ) => {
    formFour(
      eventLocationLatitude,
      eventLocationLongtude,
      eventContactPhone,
      eventLink
    );
  };

  const [inputs, setInputs] = React.useState({
    latitude: "",
    latBorder: Constants.purple,
    latHelperText: "",
    latCheckIcon: false,

    longitude: "",
    longBorder: Constants.purple,
    longHelperText: "",
    longCheckIcon: false,

    contactPhone: "",
    phoneBorder: Constants.purple,
    phoneHelperText: "",
    phoneCheckIcon: false,

    links: "",
    linkBorder: Constants.purple,
    linkHelperText: "",
    linkCheckIcon: false,
  });

  //event location map latitude onchangeText() functions

  const updateLatitude = (lat) => {
    if (lat.length <= 2) {
      setInputs({
        ...inputs,
        latitude: lat,
        latBorder: Constants.Danger,
        latHelperText: "Enter your event location map latitude",
        latCheckIcon: false,
      });
    } else if (lat.length >= 30) {
      setInputs({
        ...inputs,
        latitude: lat,
        latBorder: Constants.Danger,
        latHelperText: "Map latitude cannot be this long!",
        latCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        latitude: lat,
        latBorder: Constants.Success,
        latHelperText: "",
        latCheckIcon: true,
      });
    }
  };

  //event location map longitude onChangeText Functionality

  const updateLongitude = (long) => {
    if (long.length <= 2) {
      setInputs({
        ...inputs,
        longitude: long,
        longBorder: Constants.Danger,
        longHelperText: "Enter your event location map Longitude",
        longCheckIcon: false,
      });
    } else if (long.length >= 30) {
      setInputs({
        ...inputs,
        longitude: lat,
        longBorder: Constants.Danger,
        longHelperText: "Map longitude cannot be this long ",
        longCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        longitude: long,
        longBorder: Constants.Success,
        longHelperText: "",
        longCheckIcon: true,
      });
    }
  };

  //event Contact phone onchangeText functionality

  const updateContactPhone = (phone) => {
    if (phone.length <= 3) {
      setInputs({
        ...inputs,
        contactPhone: phone,
        phoneBorder: Constants.Danger,
        phoneHelperText: "To short to be phone number",
        phoneCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        contactPhone: phone,
        phoneBorder: Constants.Success,
        phoneHelperText: "",
        phoneCheckIcon: true,
      });
    }
  };

  //Links which provided in the link field, onchangeText it will trigger this function

  const updateLinks = (link) => {
    if (link.length <= 6) {
      setInputs({
        ...inputs,
        links: link,
        linkBorder: Constants.Danger,
        linkHelperText: "provide link to which you want your user navigate to",
        linkCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        links: link,
        linkBorder: Constants.Success,
        linkHelperText: "",
        linkCheckIcon: true,
      });
    }
  };
  const fieldBlured = () => {
    FormFourFields(
      inputs.latitude,
      inputs.longitude,
      inputs.contactPhone,
      inputs.links
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eventSession}>Additional Information (Optional)</Text>
      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.latBorder },
        ]}
      >
        <MaterialIcons name="south" size={24} color={Constants.purple} />
        <TextInput
          placeholder="Event Location Latitude"
          style={styles.selectDateBtn}
          value={inputs.latitude}
          onChangeText={(lat) => updateLatitude(lat)}
          onBlur={() => fieldBlured()}
        />
        {
          //check button on validation of input field
          inputs.latCheckIcon ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={22}
              color={Constants.Success}
              style={styles.checkIcon}
            />
          ) : null
        }
      </View>

      <HelperText
        //helper text which will promot error and suggestion and textinput fields
        style={{ color: Constants.Danger }}
      >
        {inputs.latHelperText}
      </HelperText>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.longBorder },
        ]}
      >
        <MaterialIcons name="north" size={24} color={Constants.purple} />
        <TextInput
          placeholder="Event Location Longitude"
          style={styles.selectDateBtn}
          value={inputs.longitude}
          onChangeText={(long) => updateLongitude(long)}
          onBlur={() => fieldBlured()}
        />
        {
          //check button on validation of input field
          inputs.longCheckIcon ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={22}
              color={Constants.Success}
              style={styles.checkIcon}
            />
          ) : null
        }
      </View>

      <HelperText
        //helper text which will promot error and suggestion and textinput fields
        style={{ color: Constants.Danger }}
      >
        {inputs.longHelperText}
      </HelperText>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.phoneBorder },
        ]}
      >
        <Ionicons name="call-outline" size={24} color={Constants.purple} />
        <TextInput
          placeholder="Contact Phone No "
          style={styles.selectDateBtn}
          value={inputs.contactPhone}
          onChangeText={(phone) => updateContactPhone(phone)}
          onBlur={() => fieldBlured()}
          keyboardType="phone-pad"
        />
        {
          //check button on validation of input field
          inputs.phoneCheckIcon ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={22}
              color={Constants.Success}
              style={styles.checkIcon}
            />
          ) : null
        }
      </View>

      <HelperText
        //helper text which will promot error and suggestion and textinput fields
        style={{ color: Constants.Danger }}
      >
        {inputs.phoneHelperText}
      </HelperText>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.linkBorder },
        ]}
      >
        <AntDesign name="link" size={24} color={Constants.purple} />

        <TextInput
          placeholder="Links"
          style={styles.selectDateBtn}
          value={inputs.links}
          onChangeText={(link) => updateLinks(link)}
          onBlur={() => fieldBlured()}
        />

        {
          //check button on validation of input field
          inputs.linkCheckIcon ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={22}
              color={Constants.Success}
              style={styles.checkIcon}
            />
          ) : null
        }
      </View>

      <HelperText
        //helper text which will promot error and suggestion and textinput fields
        style={{ color: Constants.Danger }}
      >
        {inputs.linkHelperText}
      </HelperText>

      <HelperText style={{ marginTop: 30 }}>
        Make sure you provided all needed Information before submitting.
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingLeft: 20,
    marginTop: 30,
  },
  eventSession: {
    marginLeft: 10,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.mainText,
    marginBottom: 10,
  },
  eventContentContainer: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
    backgroundColor: Constants.background,
    paddingLeft: 12,
    borderRadius: Constants.mediumbox,
  },
  selectDateBtn: {
    width: "86%",
    marginLeft: 15,
    paddingLeft: 2,
    padding: 9,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  selectDateTxt: {
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  enterEventPrice: {
    width: "70%",
    marginLeft: 15,
    paddingLeft: 2,
    padding: 9,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  TicketPrice: {
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 2,
    paddingRight: 4,
  },
});

export default FormFour;
