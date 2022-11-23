//import liraries
import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import { HelperText, Title } from "react-native-paper";
import {
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
} from "react-native-vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
// create a component
const UpdateEvent = ({ navigation, route }) => {
  const { item } = route.params;
  var featuredImageUri = Connection.url + Connection.assets;

  const [initialValue, setInitialValue] = useState({
    poster: item.event_image,
    title: item.event_name,
    startDate: item.start_date,
    startTime: item.start_time,
    endDate: item.end_date,
    endTime: item.end_time,
    eventAddress: item.event_address,
    price: item.event_entrance_fee,
    phone: item.contact_phone,
    url: item.redirectUrl,
    description: item.event_description,
    latitude: item.address_latitude,
    longitude: item.address_longitude,
    descHelperText: "",
  });

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState("Start Date");
  const [startTime, setStartTime] = useState("Start Time");
  const [endingDate, setEndingDate] = useState(new Date());
  const [endMode, setEndMode] = useState("date");
  const [showit, setShowit] = useState(false);
  const [endDate, setEndDate] = useState("End Date");
  const [endTime, setEndTime] = useState("End Time");
  const [inputs, setInputs] = React.useState({
    startDateBorder: Constants.Secondary,
    startTimeborder: Constants.Secondary,
    endDateBorder: Constants.Secondary,
    endTimeBoarder: Constants.Secondary,
  });

  // a code to select event start Date and time
  const onChange = (event, SelectDate) => {
    const currentDate = SelectDate || Date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let startDate =
      tempDate.getFullYear() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getDate();

    let startTime = tempDate.getHours() + ":" + tempDate.getMinutes();

    setStartDate(startDate);
    setStartTime(startTime);

    if (startDate) {
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
        startDateBorder: Constants.Faded,
        startTimeborder: Constants.Faded,
        startTimeCheckIcon: false,
        startDateCheckIcon: false,
      });
    }
  };

  // code written below is to select event end date and end a time
  const onChangeEndDate = (event, SelectedEndDate) => {
    const eventEndDate = SelectedEndDate || Date;

    setShowit(Platform.OS === "ios");
    setEndingDate(eventEndDate);

    let expiredDate = new Date(eventEndDate);

    let endDate =
      expiredDate.getFullYear() +
      "/" +
      (expiredDate.getMonth() + 1) +
      "/" +
      expiredDate.getDate();

    let endTime = "" + expiredDate.getHours() + ":" + expiredDate.getMinutes();

    setEndDate(endDate);
    setEndTime(endTime);

    if (endDate) {
      setInputs({
        ...inputs,
        endDateBorder: Constants.Success,
        endDateCheckIcon: true,
        endTimeBoarder: Constants.Success,
        endTimeCheckIcon: true,
      });
    } else {
      setInputs({
        ...inputs,
        endDateBorder: Constants.Faded,
        endTimeBoarder: Constants.Faded,
        endDateCheckIcon: false,
        endTimeCheckIcon: false,
      });
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const endDateShowMode = (eventEndDate) => {
    setShowit(true);
    setEndMode(eventEndDate);
  };

  /**************************************************** */
  //event description
  /**************************************************** */
  const EventDescription = (desc) => {
    if (desc.length <= 10) {
      setInitialValue({
        ...initialValue,
        description: desc,
        descHelperText: "Make sure event Description is more than 15 letters",
      });
    } else if (desc.length >= 5000) {
      setInitialValue({
        ...initialValue,
        description: desc,
        descHelperText: "Event Description cannot be more than 5000 letters",
      });
    } else {
      setInitialValue({
        ...initialValue,
        description: desc,
      });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Constants.background }}>
      <ScrollView
        scrollEventThrottle={16}
        style={{ backgroundColor: Constants.background }}
      >
        <View style={styles.featuredImageContainer}>
          <TouchableOpacity
            style={styles.backArrow} // back arrow button style
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={25}
              //back arrow icon
            />
          </TouchableOpacity>
          <Image
            //Featured Image of the event

            source={{ uri: featuredImageUri + initialValue.poster }} //featured image source
            resizeMode="cover"
            style={styles.image} //featured image styles
          />
        </View>

        <View style={styles.topContainer}>
          <TouchableNativeFeedback>
            <View style={styles.updatePoster}>
              <Text style={styles.updateText}>Update Poster</Text>
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback>
            <View style={styles.cancelEvent}>
              <Text style={styles.cancelText}>Cancel Event</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput value={initialValue.title} style={styles.eventName} />
        </View>

        {/* dates picker */}

        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <View style={{ width: "44%", marginLeft: 10 }}>
            <Text style={styles.label}>Start Date</Text>

            <View style={[styles.eventContentContainer, { borderWidth: 0.5 }]}>
              <Fontisto name="date" size={24} color={Constants.Secondary} />
              <TouchableOpacity
                onPress={() => showMode("date")}
                style={styles.selectDateBtn}
              >
                <Text style={styles.selectDateTxt}> {startDate}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: "column", width: "44%" }}>
            <Text style={styles.label}>Start Time</Text>
            <View style={[styles.eventContentContainer, { borderWidth: 0.5 }]}>
              <MaterialCommunityIcons
                name="clock-time-eleven-outline"
                size={24}
                color={Constants.Secondary}
              />
              <TouchableOpacity
                onPress={() => showMode("time")}
                style={styles.selectDateBtn}
              >
                <Text style={styles.selectDateTxt}> {startTime}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <View style={{ width: "44%", marginLeft: 10 }}>
            <Text style={styles.label}>End Date</Text>
            <View style={[styles.eventContentContainer, { borderWidth: 0.5 }]}>
              <Fontisto name="date" size={24} color={Constants.Secondary} />
              <TouchableOpacity
                onPress={() => endDateShowMode("date")}
                style={styles.selectDateBtn}
              >
                <Text style={styles.selectDateTxt}> {endDate}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ width: "44%", marginLeft: 10 }}>
            <Text style={styles.label}>End Time</Text>
            <View style={[styles.eventContentContainer, { borderWidth: 0.5 }]}>
              <MaterialCommunityIcons
                name="clock-time-eleven-outline"
                size={24}
                color={Constants.Secondary}
              />
              <TouchableOpacity
                onPress={() => endDateShowMode("time")}
                style={styles.selectDateBtn}
              >
                <Text style={styles.selectDateTxt}> {endTime}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* event address field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Event Address</Text>
          <TextInput
            value={initialValue.eventAddress}
            style={styles.eventName}
          />
        </View>

        {/* entrance fee */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Entrance fee (ETB)</Text>
          <TextInput
            value={initialValue.price}
            style={styles.eventName}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Contact Phone</Text>
          <TextInput
            value={initialValue.phone}
            style={styles.eventName}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Map Latitude</Text>
          <TextInput
            value={initialValue.latitude}
            style={styles.eventName}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Map Longitude</Text>
          <TextInput
            value={initialValue.longitude}
            style={styles.eventName}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Link</Text>
          <TextInput value={initialValue.url} style={styles.eventName} />
        </View>

        {/* event description */}

        <View style={styles.descContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            // a text field used accept event description
            placeholder="Write Your Event Description"
            multiline
            numberOfLines={4}
            style={styles.description}
            value={initialValue.description}
            onChangeText={(desc) => EventDescription(desc)}
            // onBlur={() => desHideHelperText()}
          />
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
        {showit && (
          <DateTimePicker
            testID="endDateTimePicker"
            value={endingDate}
            mode={endMode}
            is24Hour={true}
            display="spinner"
            onChange={onChangeEndDate}
            maximumDate={new Date(2050, 12, 31)}
            minimumDate={new Date(2000, 0, 1)}
          />
        )}
      </ScrollView>
      
        <TouchableNativeFeedback>
          <View style={styles.updateButton}>
            <Text style={styles.confirmUpdate}>Update</Text>
          </View>
        </TouchableNativeFeedback>
  
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    position: "absolute",
    top: 5,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: Constants.background,
    height: 40,
    width: 40,
    borderRadius: 50,
    elevation: 2,
  },
  // Featurd Image style
  image: {
    flex: 1,
    width: "100%",
    height: 350,

    borderWidth: 2,
    borderRadius: 20,
  },
  //featured Image Container Styling
  featuredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "96%",
    height: "90%",
  },
  // add ticket and update Event container
  TopButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.icon,
    marginHorizontal: 20,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 6,
  },
  updatePoster: {
    backgroundColor: Constants.Faded,
    padding: 8,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: Constants.tiny,
  },
  cancelEvent: {
    backgroundColor: Constants.lightRed,
    padding: 8,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: Constants.tiny,
  },
  updateText: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
    color: Constants.Secondary,
  },
  cancelText: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
    color: Constants.red,
  },
  fieldContainer: {
    width: "91%",
    alignSelf: "center",
    marginLeft: 10,
    marginTop: 5,
  },
  eventName: {
    width: "96%",
    alignSelf: "flex-start",
    padding: 8,
    paddingLeft: 15,
    paddingRight: 35,
    borderColor: Constants.Secondary,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
    borderWidth: 0.5,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.Faded,
    margin: 4,
  },
  label: {
    margin: 3,
    marginLeft: 8,
  },
  eventContentContainer: {
    width: "96%",
    flexDirection: "row",
    alignItems: "center",
    margin: 9,
    marginLeft: 0,
    backgroundColor: Constants.Faded,
    paddingLeft: 12,
    borderRadius: Constants.mediumbox,
    alignSelf: "center",
  },
  selectDateBtn: {
    width: "96%",
    marginLeft: 15,
    paddingLeft: 2,
    padding: 12,
  },
  selectDateTxt: {
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  descContainer: {
    width: "91%",
    alignSelf: "center",
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 120,
  },
  description: {
    width: "96%",
    maxHeight: 185,
    alignItems: "flex-start",
    padding: 8,
    paddingLeft: 15,
    paddingRight: 35,
    borderColor: Constants.Secondary,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
    borderWidth: 0.5,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.Faded,
    margin: 4,
  },
  updateButton: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    backgroundColor: Constants.primary,
    padding: 8,
    borderRadius: Constants.tiny,
    paddingHorizontal:40,
  },
  confirmUpdate:{
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
  }
});

//make this component available to the app
export default UpdateEvent;
