//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";

import { MaterialCommunityIcons, Ionicons } from "react-native-vector-icons";
import { Caption } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// create a component
const UpdateTicket = ({ route, navigation }) => {
  const { item } = route.params;

  var featuredImageUri = Connection.url + Connection.assets;
 
  // state declarrations
  const [poster, setPoster] = useState("placeholder.png");
  const [price, setPrice] = useState(item.currentprice);
  const [amount, setAmount]= useState(item.currentamount);
  const [errorMessage, setErrorMessage] = useState();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [expireDate, setExpireDate] = useState(item.expiredate);
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(Constants.primary);
  const [updateText, setUpdateText] = useState("update");

  //function goes below this
  const FetchImage = async () => {
    var ApiUrl = Connection.url + Connection.EventPoster;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      eventId: item.eventId,
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;
        if (message === "succeed") {
          var poster = response[0].poster[0].event_image;
          setPoster(poster);
        }
      })
      .catch((error) => {
        setPoster(poster);
      });
  };

  //show date modal
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const [inputs, setInputs] = React.useState({
    startDateBorder: Constants.Secondary,
    startDateCheckIcon: false,
    startTimeborder: Constants.Secondary,
    startTimeCheckIcon: false,
  });

  const onChange = (event, SelectDate) => {
    const currentDate = SelectDate || Date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let expireDate =
      tempDate.getFullYear() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getDate();

    setExpireDate(expireDate);

    if (expireDate) {
      setInputs({
        ...inputs,
        startDateBorder: Constants.Success,
        startTimeborder: Constants.Success,
        startDateCheckIcon: true,
        startTimeCheckIcon: true,
      });
    } else {
      setInputs({
        ...inputs,
        startDateBorder: Constants.Secondary,
        startTimeborder: Constants.Secondary,
        startTimeCheckIcon: false,
        startDateCheckIcon: false,
      });
    }
  };

  //onchange of ticket price field text
  const TicketPrices = (fees) => {
    var numbers = /^[0-9,]+$/;
    if (fees.match(numbers)) {
      setPrice(fees);
    } else {
      setErrorMessage("Ticket price cannot be other than number and comma");
      setPrice(fees);
    }
  };
// on change text of ticket amount 
const TicketAmount = (ticketamount)=>{
  setAmount(ticketamount);
}
  //main function in the screen to executed when user press add to event button
  const Update = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    let id = await AsyncStorage.getItem("userId");

    if (price == 0 || amount == 0 || expireDate == 0) {
      setErrorMessage("Please fill all fields!");
    } else {
      setErrorMessage("");
      setUpdating(true);
      var ApiUrl = Connection.url + Connection.UpdateTicket;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };

      var Data = {
        userId: id,
        ticketId: item.id,
        price: price,
        amount: amount,
        expireDate: expireDate,
        tstatus: item.status,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          var message = response[0].message;

          if (message === "succeed") {
            setUpdateButton(Constants.green);
            setUpdateText("Updated");
            setUpdating(false);
          } else {
            setErrorMessage("Can not update retry later!");
            setUpdating(false);
          }
        })

        .catch((error) => {
          setErrorMessage("There is error retry later!");
          setUpdating(false);
          console.log(error);
        });
      return () => {
        controller.abort();
      };
    }
  };

  // declare screen useEffect hook
  useEffect(() => {
    let isApiSubscribed = true;
    if (isApiSubscribed) {
      FetchImage();
    }

    return () => {
      isApiSubscribed = false;
    };
  }, [poster]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
   
      <View style={styles.EventTitle}>
        <Text
          numberOfLines={2}
          style={styles.eventName} // event name on event detail section
        >
          {item.event_name}
        </Text>
      </View>

      <Image
        //Featured Image of the event
        source={{ uri: featuredImageUri + item.event_image}} //featured image source
        resizeMode="cover"
        style={styles.eventPoster} //featured image styles
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 30,
          marginTop: 10,
        }}
      >
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={20}
          color={Constants.primary}
        />
        <Text
          style={{
            marginLeft: 4,
            fontWeight: Constants.Bold,
            fontSize: Constants.headingone,
            color: Constants.primary,
          }}
        >
          {item.tickettype} Ticket
        </Text>
      </View>
      {/* Ticket price and currency */}
      <View style={styles.ticketPriceContainer}>
        <Text
          style={{
            marginLeft: 30,
            marginTop: 6,
            marginBottom: -5,
            padding: 0,
            fontWeight: Constants.Boldtwo,
            color: Constants.Secondary,
          }}
        >
          Ticket Price
        </Text>

        <View style={styles.pricefieldContainer}>
          <TextInput
            placeholder="Price"
            keyboardType="numeric"
            style={styles.pricefield}
            value={price}
            onChangeText={(fees) => TicketPrices(fees)}
          />
          <Text style={styles.currencyText}>ETB</Text>
        </View>
      </View>

      <View style={styles.ticketAmountContainer}>
        <Text
          style={{
            marginLeft: 30,
            marginTop: 6,
            marginBottom: -5,
            padding: 0,
            fontWeight: Constants.Boldtwo,
            color: Constants.Secondary,
          }}
        >
          Amount of Ticket
        </Text>

        <View style={styles.pricefieldContainer}>
          <TextInput
            placeholder="Amount"
            keyboardType="numeric"
            style={styles.amountfield}
            value={amount}
            onChangeText={(number) => TicketAmount(number)}
          />
        </View>
      </View>

      <View>
        <Text
          style={{
            marginLeft: 30,
            marginTop: 4,
            marginBottom: -5,
            padding: 0,
            fontWeight: Constants.Boldtwo,
            color: Constants.Secondary,
          }}
        >
          Expiration Date
        </Text>

        <View
          style={[
            styles.eventContentContainer,
            { borderWidth: 0.3, borderColor: inputs.startDateBorder },
          ]}
        >
          <TouchableOpacity
            onPress={() => showMode("date")}
            style={styles.selectDateBtn}
          >
            <Text style={styles.selectDateTxt}> {expireDate}</Text>
          </TouchableOpacity>
          {
            //check button on validation of input field
            inputs.startDateCheckIcon ? (
              <MaterialCommunityIcons
                name="checkbox-marked-circle"
                size={22}
                color={Constants.Success}
                style={styles.checkIcon}
              />
            ) : null
          }
        </View>
      </View>

      {/* Add ticket to event button */}

      <TouchableWithoutFeedback onPress={() => Update()}>
        <View style={[styles.addtoEventBtn, { backgroundColor: updateButton }]}>
          {updating ? (
            <ActivityIndicator size="large" color={Constants.Inverse} />
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {updateText === "Updated" ? (
            <MaterialCommunityIcons name="check" size={32} color={Constants.background}/>
              ) : <MaterialCommunityIcons name="check" size={32} color={Constants.Inverse}/>}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <View>
        <Text style={styles.errorText}> {errorMessage}</Text>
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="spinner"
          collapsable={true}
          onChange={onChange}
          maximumDate={new Date(2050, 12, 31)}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}
    
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
    paddingTop: 10,
  },
  eventPoster: {
    width: "86%",
    height: 200,
    alignSelf: "center",
    borderRadius: Constants.tiny,
  },
  eventName: {
    width: "96%",
    marginTop: 5,
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.mainText,
    paddingRight: 4,
  },
  EventTitle: {
    margin: 10,
    marginTop: 4,
    paddingLeft: 18,
  },
  Tickettype: {
    margin: 10,
    marginTop: 4,
    paddingLeft: 20,
  },
  category: {
    width: "92%",
    alignSelf: "flex-start",
    marginLeft: 5,
    justifyContent: "center",
  },
  catSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Constants.tinybox,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "94%",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    padding: 10,
    margin: 10,
    marginLeft: 25,
    borderWidth: 0.3,
    borderColor: Constants.Secondary,
  },
  selectedCategory: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
    paddingLeft: 10,
  },
  catModal: {
    width: "96%",
    backgroundColor: Constants.background,
    justifyContent: "center",
    alignItems: "center",
  },
  Categories: {
    width: "96%",

    backgroundColor: Constants.Faded,
    alignSelf: "center",
    marginTop: 110,
    marginBottom: 80,
    borderRadius: 15,
  },
  closeModal: {
    position: "absolute",
    right: 20,
    top: 15,
  },
  modalTitle: {
    position: "absolute",
    left: 20,
    top: 15,
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
  },
  catFlatlist: {
    marginTop: 60,
    margin: 15,
  },
  CategoryList: {
    padding: 10,
    margin: 3,
    backgroundColor: Constants.background,
    borderRadius: Constants.tiny,
  },
  catName: {
    fontSize: Constants.headingtwo,
    color: Constants.Secondary,
    marginLeft: 6,
  },
  ticketListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    margin: 3,
    backgroundColor: Constants.background,
    borderRadius: Constants.medium,
  },
  TicketIcon: {
    margin: 4,
    padding: 6,
    backgroundColor: Constants.Faded,
    borderRadius: 20,
  },
  closeBtn: {
    backgroundColor: Constants.background,
    borderRadius: 50,
    padding: 2,
    elevation: 1,
  },
  ticketPriceContainer: {
    flexDirection: "column",
  },
  pricefieldContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pricefield: {
    width: "71%",
   // backgroundColor: Constants.Faded,
    borderBottomLeftRadius: Constants.tinybox,
    borderTopLeftRadius: Constants.tinybox,
    margin: 4,
    marginRight: 0,
    padding: 5.5,
    paddingLeft: 16,
    borderWidth: 0.3,
    borderColor: Constants.Secondary,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
  },
  amountfield: {
    width: "91%",
    //backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    margin: 4,
    marginRight: 0,
    padding: 6,
    paddingLeft: 16,
    borderWidth: 0.3,
    borderColor: Constants.Secondary,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
  },
  currencyText: {
    width: "20%",
    backgroundColor: Constants.Secondary,
    textAlign: "center",
    padding: 10,
    borderBottomRightRadius: Constants.tinybox,
    borderTopRightRadius: Constants.tinybox,
    color: Constants.background,
    fontWeight: Constants.Bold,
    borderWidth: 0.4,
    borderColor: Constants.Secondary,
  },
  TextField: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  numberofticketfield: {
    width: "92%",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    margin: 4,
    marginRight: 0,
    padding: 8,
    paddingLeft: 16,
    borderWidth: 0.3,
    borderColor: Constants.Secondary,
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
  },

  eventContentContainer: {
    width: "87%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
    marginLeft: 12,
    //backgroundColor: Constants.Faded,
    paddingLeft: 10,
    borderRadius: Constants.tinybox,
  },
  selectDateBtn: {
    width: "86%",
    marginLeft: 8,
    paddingLeft: 2,
    padding: 12,
  },
  selectDateTxt: {
    fontSize: Constants.headingthree,
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
  addtoEventBtn: {
    position: "absolute",
    bottom: 20,
    right:10,
    width:50, height:50,
    padding: 7,
    borderRadius: 50,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
 
  },
  btntxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.mainText,
  },
  errorText: {
    marginVertical: 15,
    width: "70%",
    padding: 8,
    borderRadius: Constants.tiny,
    paddingHorizontal: 20,
    fontWeight: Constants.Boldtwo,
    color: Constants.Danger,
    alignSelf: "center",
    textAlign: "center",
  },
});

//make this component available to the app
export default UpdateTicket;
