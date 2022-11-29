import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Constants from "../constants/Constants";
import { Divider, HelperText } from "react-native-paper";
import Connection from "../constants/connection";
import TicketDetail from "./TicketDetail";

function CheckoutScreen({ navigation, route }) {
  const { pass } = route.params;

  const [selection, setSelection] = useState(null);
  const [agent, setAgent] = useState();
  const [price, setPrice] = useState();
  const [contactInfo, setContactInfo] = useState({
    fullname: "",
    nameBorder: Constants.Secondary,
    errorMessage: "",
    nameError: false,

    phone: "",
    phoneBorder: Constants.Secondary,
    phoneErrorMessage: "",
    phoneError: false,
  });

  //onchangeText triggered in fullname field
  const fullname = (name) => {
    setContactInfo({
      ...contactInfo,
      fullname: name,
    });
  };

  //onchange happened in phone field

  const Phone = (phone) => {
    setContactInfo({
      ...contactInfo,
      phone: phone,
    });
  };

  /**************************************** */
  //on pay button pressed
  /************************************** */
  const Pay = () => {
    var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    var message;
    if (contactInfo.fullname.length == 0) {
      setContactInfo({
        ...contactInfo,
        nameBorder: Constants.red,
        errorMessage: "Please enter you full name, letter only",
        nameError: true,
      });
    } else if (!regName.test(contactInfo.fullname)) {
      setContactInfo({
        ...contactInfo,
        nameBorder: Constants.red,
        errorMessage: "Full name can not contain number or special characters",
        nameError: true,
      });
    } else if (contactInfo.fullname.length > 30) {
      setContactInfo({
        ...contactInfo,
        nameBorder: Constants.red,
        errorMessage: "Full name can not be more than 30 letter",
        nameError: true,
      });
    }
    if (contactInfo.fullname.length < 2) {
      setContactInfo({
        ...contactInfo,
        nameBorder: Constants.red,
        errorMessage: "Full name can not be less than 2 letter",
        nameError: true,
      });
    } else if (contactInfo.phone == 0) {
      setContactInfo({
        ...contactInfo,
        phoneBorder: Constants.red,
        phoneErrorMessage: "Please enter your Phone Number",
        phoneError: true,
      });
    } else {
      setContactInfo({
        ...contactInfo,
        nameBorder: Constants.Inverse,
        errorMessage: "",
        nameError: false,
        phoneBorder: Constants.Inverse,
        phoneErrorMessage: "",
        phoneError: false,
      });

      // we call backend from here

      var ApiUrl = Connection.url + Connection.Payment;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };
       var totalPrice = pass.currentprice*pass.amount;
      var Data = {
        id: pass.id,
        eventId: pass.eventId,
        username: contactInfo.fullname,
        phone: contactInfo.phone,

        ticketName: pass.event_name,
        type: pass.tickettype,
        eachprice: pass.currentprice,
        quantity: pass.amount,
        total: totalPrice,
        agent: agent,
      };


      fetch(ApiUrl,{
        method: "POST",
        headers:headers,
        body: JSON.stringify(Data),

            })
            .then((response)=> response.json())
            .then((response)=>{
               message = response[0].message;

              if(message === "succeed"){
                alert("succeed");
              }
              else {
                alert("Some Problems");
              }
            })
            .catch((error)=>{
              console.log("chigr alee"+error);
            });
    }
   
  };

  //on component did mount
  useEffect(() => {
    
    return () => {};
  }, [selection]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={{ height: 160 }}>
        <View style={styles.ticketcheckout}>
          <View style={styles.leftCheckout}>
            <Text style={styles.eventName}>{pass.event_name}</Text>

            <View style={styles.ttype}>
              <Text
                style={{
                  fontSize: Constants.headingtwo,
                  fontWeight: Constants.Bold,
                  color: Constants.Inverse,
                  fontStyle: "italic",
                }}
              >
                {pass.amount}
              </Text>

              <Text
                style={{
                  marginLeft: 8,
                  fontSize: Constants.headingtwo,
                  fontWeight: Constants.Boldtwo,
                  color: Constants.Inverse,
                  fontStyle: "italic",
                }}
              >
                {pass.tickettype} Ticket
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              padding: 5,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#7B3F00",
                fontSize: 17,
                paddingRight: 8,
                fontWeight: "bold",
              }}
            >
              Total
            </Text>
            <View
              style={{
                flexDirection: "row",
                padding: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7B3F00",
                  fontSize: Constants.headingone,

                  fontWeight: Constants.Bold,
                }}
              >
                {pass.currentprice * pass.amount}
              </Text>
              <Text
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7B3F00",
                  fontSize: Constants.headingone,
                  paddingRight: 8,
                  fontWeight: "bold",
                }}
              >
                {pass.originalprice} ETB
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ticketPriceContainer}>
          <Text
            style={{
              marginLeft: 30,
              marginTop: 16,
              marginBottom: -5,
              padding: 0,
              fontWeight: Constants.Boldtwo,
              color: Constants.Secondary,
            }}
          >
            Contact Informations
          </Text>

          <View style={styles.fullnameContainer}>
            <TextInput
              placeholder="Full name"
              style={[
                styles.pricefield,
                { borderColor: contactInfo.nameBorder },
              ]}
              value={contactInfo.fullname}
              onChangeText={(name) => fullname(name)}
            />
          </View>
          {contactInfo.nameError ? (
            <Text style={styles.error}>{contactInfo.errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.ticketPriceContainer}>
          <View style={styles.phonefieldContainer}>
            <Text style={styles.code}>+251</Text>
            <TextInput
              placeholder="Phone"
              keyboardType="phone-pad"
              style={[
                styles.phonefield,
                { borderColor: contactInfo.phoneBorder },
              ]}
              value={contactInfo.phone}
              onChangeText={(phone) => Phone(phone)}
            />
          </View>
          {contactInfo.phoneError ? (
            <Text style={styles.error}>{contactInfo.phoneErrorMessage}</Text>
          ) : null}
        </View>
        <Divider style={{ marginTop: 15 }} />

        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[
              styles.btn,
              selection === 1
                ? [
                    { backgroundColor: "#ebebeb" },
                    { borderWidth: 1 },
                    { borderColor: "green" },
                  ]
                : { backgroundColor: "white" },
            ]}
            onPress={() =>{ setSelection(1); setAgent(1)}}
          >
            {selection === 1 ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color="green"
                style={{ position: "absolute", right: 6, top: 6 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="radiobox-blank"
                size={18}
                color={Constants.Secondary}
                style={{ position: "absolute", right: 6, top: 6 }}
              />
            )}
            <View style={styles.LeftPayment}>
              <Image
                style={styles.Paymentlogo}
                source={{
                  uri: "https://play-lh.googleusercontent.com/Mtnybz6w7FMdzdQUbc7PWN3_0iLw3t9lUkwjmAa_usFCZ60zS0Xs8o00BW31JDCkAiQk",
                }}
              />
              <Text
                style={[
                  styles.btnText,
                  selection === 1 ? { color: "black" } : null,
                ]}
              >
                Telebirr
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              selection === 2
                ? [
                    { backgroundColor: "#ebebeb" },
                    { borderWidth: 1, borderColor: "green" },
                  ]
                : { backgroundColor: "white" },
            ]}
            onPress={() => {setSelection(2); setAgent(2)}}
          >
            {selection === 2 ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color="green"
                style={{ position: "absolute", right: 6, top: 6 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="radiobox-blank"
                size={18}
                color={Constants.Secondary}
                style={{ position: "absolute", right: 6, top: 6 }}
              />
            )}
            <View style={styles.LeftPayment}>
              <Image
                style={styles.Paymentlogo}
                source={{
                  uri: "https://addisbiz.com/wp-content/uploads/Commercial-Bank-logo-1280x720.jpg",
                }}
              />
              <Text
                style={[
                  styles.btnText,
                  selection === 2 ? { color: "black" } : null,
                ]}
              >
                CBE
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              selection === 3
                ? [
                    {
                      backgroundColor: "#ebebeb",
                      borderWidth: 1,
                      borderColor: "green",
                    },
                  ]
                : { backgroundColor: "white" },
            ]}
            onPress={() => {setSelection(3); setAgent(3)}}
          >
            {selection === 3 ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color="green"
                style={{ position: "absolute", right: 6, top: 6 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="radiobox-blank"
                size={18}
                color={Constants.Secondary}
                style={{ position: "absolute", right: 6, top: 6 }}
              />
            )}
            <View style={styles.LeftPayment}>
              <Image
                style={styles.Paymentlogo}
                source={{
                  uri: "https://play-lh.googleusercontent.com/GEjGBnUGMkupE8FpnT9LiqSzuS-_1n2sms1xJu8sPKp-JQsA92u8Fl-pKuk0E_x4SmM",
                }}
              />
              <Text
                style={[
                  styles.btnText,
                  selection === 3 ? { color: "black" } : null,
                ]}
              >
                Amole
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {selection && (
          <View style={[styles.paybtn, { marginHorizontal: 10 }]}>
            <TouchableOpacity
              onPress={() => Pay()}
              style={styles.paybuttonStyle}
            >
              <Text style={styles.paytxt}>Pay</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Constants.Faded,
  },
  paybuttonStyle: {
    width: 50,
    marginHorizontal: 100,
  },
  Paymentlogo: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  LeftPayment: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnGroup: {
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    height: "auto",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    alignItems: "center",
  },
  btn: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 8,
    paddingVertical: 20,
    marginVertical: 10,
  },
  btnText: {
    // textAlign: 'center',
    fontWeight: "bold",

    fontSize: 14,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
  },
  leftCheckout: {
    padding: 4,
  },
  eventName: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  ttype: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  ticketcheckout: {
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    padding: 20,
    flexDirection: "row",
    backgroundColor: Constants.primary,
    paddingVertical: 40,
  },
  imageContainer: {
    alignItems: "center",
    height: 50,
    width: 50,
    paddingRight: 10,
  },
  image: {
    borderRadius: 10,
    height: 50,
    resizeMode: "cover",
    width: 50,
  },
  paybtn: {
    width: "45%",
    alignSelf: "center",
    justifyContent: "center",
  },
  paybuttonStyle: {
    alignSelf: "center",
    padding: 7,
    paddingHorizontal: 45,
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
  },
  paytxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
  },
  ticketPriceContainer: {
    flexDirection: "column",
  },
  fullnameContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pricefield: {
    width: "87%",
    borderRadius: Constants.tinybox,
    margin: 4,
    marginRight: 0,
    padding: 6,
    paddingLeft: 16,
    borderWidth: 0.5,
    borderColor: Constants.Secondary,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
  },

  TextField: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  phonefieldContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    textAlign: "center",
    padding: 10,
    color: Constants.Inverse,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
    borderWidth: 0.5,
    borderColor: Constants.Secondary,
    borderRadius: Constants.tinybox,
  },
  phonefield: {
    width: "72%",

    borderRadius: Constants.tinybox,
    margin: 4,
    marginRight: 0,
    padding: 6,
    paddingLeft: 16,
    borderWidth: 0.5,
    borderColor: Constants.Secondary,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
  },
  error: {
    color: Constants.red,
    fontSize: Constants.textSize,
    marginLeft: 38,
    marginTop: -6,
    marginBottom: 4,
  },
});

export default CheckoutScreen;
