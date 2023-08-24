import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Linking,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Constants from "../../constants/Constants";
import { Divider, HelperText, Checkbox, IconButton } from "react-native-paper";
import Connection from "../../constants/connection";
import TicketDetail from "./TicketDetail";

import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  startTimer,
  stopTimer,
  decreaseTime,
  releaseTicket,
} from "../../Reducer/TimerSlice";
import { P2bAnimatedBtn } from "../../ui-components/Button";
import { Typography } from "../../themes/typography";
import Gateways from "./components/payment";
import { PaymentGateways } from "../../data/PaymentGateways";

function CheckoutScreen({ route }) {
  const { pass } = route.params;
  const TicketInfo = pass;
  const { theme } = useTheme();

  const dispatch = useDispatch();
  const timerRunning = useSelector((state) => state.timer.timerRunning);
  const remainingTime = useSelector((state) => state.timer.remainingTime);
  const ticketData = useSelector((state) => state.timer.ticketData);

  const [selection, setSelection] = useState(null);
  const [agent, setAgent] = useState();
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

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

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

  const ChooseGateway = (gateway) => {
    if (selection === gateway.name) {
      setSelection(null);
    } else {
      setSelection(gateway.name);
    }
  };

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
        errorMessage: "Please enter you full name, letter only",
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

      var Data = {
        id: pass.id,
        userId: pass.userId,
        eventId: pass.eventId,
        username: contactInfo.fullname,
        phone: contactInfo.phone,

        eventName: pass.event_name,
        type: pass.tickettype,
        eachprice: pass.currentprice,
        quantity: pass.amount,
        agent: agent,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          message = response[0].message;

          if (message === "succeed") {
            alert("succeed");
          } else {
            alert("Some Problems");
          }
        })
        .catch((error) => {
          console.log("in checkout screen" + error);
        });
    }
  };
  const start = () => {
    const ticket = {
      id: pass.id,
      userId: pass.userId,
      quantity: pass.amount,
    };

    dispatch(startTimer(ticket));
  };

  //on component mount
  useEffect(() => {
    if (
      !ticketData ||
      ticketData.id !== TicketInfo.id ||
      ticketData.quantity !== TicketInfo.amount
    ) {
      start();
    }
    return () => {};
  }, [TicketInfo]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background.faded }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Divider style={{ backgroundColor: theme.primary[600] }} />

        <View style={styles.leftCheckout}>
          <View style={styles.detailrow}>
            <Text style={styles.infoLabel}>Event</Text>

            <Text
              style={[
                styles.infoValue,
                {
                  fontWeight: Typography.weight.bold,
                  fontSize: Typography.size.headingtwo,
                },
              ]}
            >
              {pass.event_name}
            </Text>
          </View>

          <View style={styles.detailrow}>
            <Text style={styles.infoLabel}>Ticket</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.infoValue}> {pass.tickettype}</Text>
              <MaterialCommunityIcons
                name="close"
                size={12}
                style={{ marginHorizontal: 4 }}
              />
              <Text style={styles.infoValue}>{pass.amount}</Text>
            </View>
          </View>

          <View style={styles.detailrow}>
            <Text style={styles.infoLabel}>Each Price </Text>

            <Text style={styles.infoValue}>{pass.currentprice} ETB</Text>
          </View>

          <View style={styles.detailrow}>
            <Text style={styles.infoLabel}>Total</Text>

            <Text
              style={[
                styles.infoValue,
                {
                  fontWeight: Typography.weight.extraBold,
                  fontSize: Typography.size.headingtwo,
                },
              ]}
            >
              {parseFloat(pass.currentprice * pass.amount).toFixed(2)} ETB
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              marginLeft: 24,
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
          {contactInfo.nameError && (
            <Text style={styles.error}>{contactInfo.errorMessage}</Text>
          )}
        </View>

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

        {contactInfo.phoneError && (
          <Text style={styles.error}>{contactInfo.phoneErrorMessage}</Text>
        )}

        <Divider style={{ marginTop: 15 }} />

        <View style={styles.btnGroup}>
          {PaymentGateways.map((gateway) => (
            <Gateways
              key={gateway.id}
              logo={gateway.logo}
              name={gateway.name}
              onPress={() => ChooseGateway(gateway)}
              isChecked={selection === gateway.name ? true : false}
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 15,
            marginBottom: 90,
          }}
        >
          <Checkbox
            status={isChecked ? "checked" : "unchecked"}
            onPress={handleCheckboxChange}
            color={theme.blue.main}
            position="leading"
          />

          <Text>I agree to </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => Linking.openURL(Constants.terms)}
          >
            <Text style={{ color: theme.blue[700] }}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {selection && isChecked && (
        <P2bAnimatedBtn
          title={`Pay${" with " + selection}`}
          animation="zoomIn"
          duration={8}
          isSubmitting={false}
          onPress={() => Pay()}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
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
    width: Dimensions.get("screen").width,
    flexWrap: "wrap",
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    justifyContent: "center",
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
    width: Dimensions.get("screen").width,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 18,
    backgroundColor: Constants.primary,
  },

  detailrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingLeft: 5,
  },
  infoLabel: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
  infoValue: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
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

  fullnameContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pricefield: {
    width: "94%",
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
    width: "78%",
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
    marginLeft: 24,
    marginTop: -6,
    marginBottom: 4,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 12,
    backgroundColor: Constants.primary,
    borderBottomWidth: 0.3,
    borderBottomColor: Constants.Inverse,
    paddingBottom: 5,
  },
  timerTxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    marginLeft: 4,
  },
});

export default CheckoutScreen;
