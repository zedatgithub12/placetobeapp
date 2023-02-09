import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { HelperText, Title } from "react-native-paper";
import Constants from "../constants/Constants";
import { MaterialCommunityIcons, Fontisto } from "react-native-vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "./context";

const FormTwo = () => {
  // a useContent hook which will treat all input value as global variables
  // the eventproperties variable is declared inside App mathod bacause we need to keep all gloabal varibales in top tree
  // value collect from input field will be access inside Submit event class found in Screens folder
  // while submitting event it will validate the value stored in glabal scope

  const { formTwo } = React.useContext(AuthContext);

  const formTwoFieldsValue = (startDate, startTime, endDate, endTime) => {
    formTwo(startDate, startTime, endDate, endTime);
  };

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
    startDateBorder: Constants.purple,
    startDateCheckIcon: false,

    startTimeborder: Constants.purple,
    startTimeCheckIcon: false,

    endDateBorder: Constants.purple,
    endDateCheckIcon: false,

    endTimeBoarder: Constants.purple,
    endTimeCheckIcon: false,
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
      formTwoFieldsValue(startDate, startTime, endDate, endTime);
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

      formTwoFieldsValue(startDate, startTime, endDate, endTime);
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

  return (
    <View style={styles.container}>
      <Text style={styles.eventSession}>Provide Event Sessions</Text>
      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.startDateBorder },
        ]}
      >
        <Fontisto name="date" size={24} color={Constants.purple} />
        <TouchableOpacity
          onPress={() => showMode("date")}
          style={styles.selectDateBtn}
        >
          <Text style={styles.selectDateTxt}> {startDate}</Text>
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

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.startTimeborder },
        ]}
      >
        <MaterialCommunityIcons
          name="clock-time-eleven-outline"
          size={24}
          color={Constants.purple}
        />
        <TouchableOpacity
          onPress={() => showMode("time")}
          style={styles.selectDateBtn}
        >
          <Text style={styles.selectDateTxt}> {startTime}</Text>
        </TouchableOpacity>
        {
          //check button on validation of input field
          inputs.startTimeCheckIcon ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={22}
              color={Constants.Success}
              style={styles.checkIcon}
            />
          ) : null
        }
      </View>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.endDateBorder },
        ]}
      >
        <Fontisto name="date" size={24} color={Constants.purple} />
        <TouchableOpacity
          onPress={() => endDateShowMode("date")}
          style={styles.selectDateBtn}
        >
          <Text style={styles.selectDateTxt}> {endDate}</Text>
        </TouchableOpacity>
        {
          //check button on validation of input field
          inputs.endDateCheckIcon ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={22}
              color={Constants.Success}
              style={styles.checkIcon}
            />
          ) : null
        }
      </View>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 0.5, borderColor: inputs.endTimeBoarder },
        ]}
      >
        <MaterialCommunityIcons
          name="timer-outline"
          size={24}
          color={Constants.purple}
        />
        <TouchableOpacity
          onPress={() => endDateShowMode("time")}
          style={styles.selectDateBtn}
        >
          <Text style={styles.selectDateTxt}> {endTime}</Text>
        </TouchableOpacity>
        {
          //check button on validation of input field
          inputs.endTimeCheckIcon ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={22}
              color={Constants.Success}
              style={styles.checkIcon}
            />
          ) : null
        }
      </View>

      <HelperText style={{ marginTop: 30 }}>
        While selecting time using time picker use 24 hour format.
      </HelperText>
      <HelperText>Ex: for 6:00 pm -{">"} 18:00</HelperText>
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
    margin: 10,
    marginLeft: 0,
    backgroundColor: Constants.background,
    paddingLeft: 12,
    borderRadius: Constants.tiny,
    borderWidth: 0.3,
  },
  selectDateBtn: {
    width: "86%",
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
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 2,
    paddingRight: 4,
  },
});

export default FormTwo;
