//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  TouchableNativeFeedback,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import TicketType from "../src/TicketType";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { Caption } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// create a component
const AddTicket = ({ route, navigation }) => {
  const { item } = route.params;

  var featuredImageUri = Connection.url + Connection.assets;

  // state declarrations
  const [price, setPrice] = useState();
  const [numberofTicket, setNumberofTicket] = useState();
  const [errorMessage, setErrorMessage] = useState();

  /********************************** *
  ticket type selector
************************************/
  const [category, setCategory] = useState("Regular");
  const [TicketIcon, setTicketIcon] = useState("ticket");
  const [modalVisible, setModalVisible] = useState(false); // category modal state
  const OnSelectCategory = (itemName, icon) => {
    setCategory(itemName);
    setModalVisible(false);
    setTicketIcon(icon);
  };

  /******************************************
   Expire date picker
   */
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [expireDate, setExpireDate] = useState("Date");

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  //on date change
  const [inputs, setInputs] = React.useState({
    startDateBorder: Constants.Secondary,
    startDateCheckIcon: false,

    startTimeborder: Constants.Secondary,
    startTimeCheckIcon: false,
  });
  // a code to select event start Date
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

    //let startTime = tempDate.getHours() + ":" + tempDate.getMinutes();

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

  // on change text of ticket number
  const NumofTicket = (count) => {
    var numbers = /^[0-9,]+$/;
    if (count.match(numbers)) {
      setNumberofTicket(count);
    
    } else {
      setErrorMessage("Number of ticket cannot be other than number and comma");
      setNumberofTicket(count);
    }
  };

  //main function in the screen to executed when user press add to event button
  const AddingTicket = async() => {
    let id = await AsyncStorage.getItem("userId");
    var numbers = /^[0-9,.]+$/;
    if (price == 0 || numberofTicket == 0 || expireDate === "Date") {
      setErrorMessage("Please fill all fields!");
    }
    else if(!price.match(numbers)){
      setErrorMessage("Please enter valid price!");
    }
     else {
      setErrorMessage("");

      var ApiUrl = Connection.url + Connection.AddTicket;
      var headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };
       
      var Data = {
        userId: id,
        eventId: item.event_id,
        eventName: item.event_name,
        eventImage: item.event_image,
        type: category,
        price: price,
        Amount: numberofTicket,
        expireDate: expireDate,
        
      };
     
      fetch(ApiUrl,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),

      })
      .then((response) => response.json())
      .then((response)=>{

        var message = response[0].message;

        if(message === "succeed"){
            navigation.navigate("Ticket Added");
        }
        else if(message === "exist")
        {
          setErrorMessage("This ticket is already added");
        }
        else
        {
          setErrorMessage("you cannot add ticket now retry later!");
        }
      })
      .catch((error)=>{
        console.log(error);
      });

    }
  };

  // declare screen useEffect hook
  useEffect(() => {
    return () => {};
  });

  const renderCategory = ({ item }) => (
    <TouchableNativeFeedback
      style={[styles.CategoryList]}
      onPress={() => OnSelectCategory(item.name, item.icon)}
    >
      <View style={styles.ticketListItem}>
        <MaterialCommunityIcons
          name={item.icon}
          size={20}
          color={Constants.primary}
          style={styles.TicketIcon}
        />
        <Text style={styles.catName}>{item.name}</Text>
      </View>
    </TouchableNativeFeedback>
  );

  return (
    <KeyboardAvoidingView  style={styles.container}>
   
      <Image
        //Featured Image of the event

        source={{ uri: featuredImageUri + item.event_image }} //featured image source
        resizeMode="cover"
        style={styles.eventPoster} //featured image styles
      />

      <View style={styles.EventTitle}>
        <Text
          numberOfLines={2}
          style={styles.eventName} // event name on event detail section
        >
          {item.event_name}
        </Text>
      </View>

      {
        //select category section
      }
      <View style={styles.category}>
        <Modal
          //modal with a list of category
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          style={styles.catModal}
        >
          <View style={styles.Categories}>
            <Pressable
              style={styles.closeModal}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AntDesign
                name="minus"
                size={24}
                color={Constants.red}
                style={styles.closeBtn}
              />
            </Pressable>
            <Caption style={styles.modalTitle}>Ticket Type</Caption>

            <FlatList
              data={TicketType}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              style={styles.catFlatlist}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Modal>

        <Text
          style={{
            marginLeft: 25,
            marginTop: 10,
            marginBottom: -5,
            padding: 0,
            fontWeight: Constants.Boldtwo,
            color: Constants.Secondary,
          }}
        >
          Select Ticket Type
        </Text>
        <Pressable
          //Button which open the category modal
          style={styles.selector}
          onPress={() => setModalVisible(true)}
        >
          <View style={[styles.catSelector]}>
            <MaterialCommunityIcons
              name={TicketIcon}
              size={22}
              color={Constants.primary}
            />

            <Text style={[styles.selectedCategory]}>{category}</Text>
          </View>

          <View>
            <MaterialCommunityIcons
              name="chevron-down"
              size={22}
              color={Constants.Secondary}
            />
          </View>
        </Pressable>
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

      {/* Number of ticket field */}

      <View style={styles.CountContainer}>
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
          Number of Tickets
        </Text>

        <View style={styles.TextField}>
          <TextInput
            placeholder="How many tickets to sale?"
            keyboardType="numeric"
            style={styles.numberofticketfield}
            value={numberofTicket}
            onChangeText={(count) => NumofTicket(count)}
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

      <TouchableNativeFeedback onPress={() => AddingTicket()}>
        <View style={styles.addtoEventBtn}>
          <Text style={styles.btntxt}>Add to Event</Text>
        </View>
      </TouchableNativeFeedback>

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
          minimumDate={new Date(2023, 0, 1)}
        />
      )}
 
    </KeyboardAvoidingView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
  },
  eventPoster: {
    width: "100%",
    height: 120,
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
    paddingLeft: 10,
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
    //backgroundColor: Constants.Faded,
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
    //backgroundColor: Constants.Faded,
    borderBottomLeftRadius: Constants.tinybox,
    borderTopLeftRadius: Constants.tinybox,
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
    //backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    margin: 4,
    marginRight: 0,
    padding: 8,
    paddingLeft: 16,
    borderWidth: 0.3,
    borderColor: Constants.Secondary,
    fontWeight: Constants.Bold,
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
    color: Constants.Secondary,
  },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 2,
    paddingRight: 4,
  },
  addtoEventBtn: {
    position: "absolute",
    bottom: 25,
    width: "60%",
    padding: 9,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.primary,
    margin: 20,

    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  btntxt: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
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
export default AddTicket;
