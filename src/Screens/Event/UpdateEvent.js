//import liraries
import React, { Component, useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Connection from "../../constants/connection";
import Constants from "../../constants/Constants";
import {
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
} from "react-native-vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { HelperText } from "react-native-paper";
import * as Animatable from "react-native-animatable";

// create a component
const UpdateEvent = ({ navigation, route }) => {
  const { item } = route.params;
  var featuredImageUri = Connection.url + Connection.assets;

  const TimeFun = (eventTime) => {
    var time = eventTime;
    var result = time.slice(0, 2);
    var minute = time.slice(3, 5);
    var globalTime;
    var postMeridian;
    var separator = ":";
    if (result > 12) {
      postMeridian = result - 12;
      globalTime = "PM";
    } else {
      postMeridian = result;
      globalTime = "AM";
    }

    return result + separator + minute;
  };

  const [initialValue, setInitialValue] = useState({
    poster: item.event_image,
    title: item.event_name,
    titleHelper: "",
    titleBorder: Constants.Inverse,
    showTitleHelper: false,

    organizer: item.event_organizer,
    orgHelper: "",
    orgBorder: Constants.Inverse,
    showOrgHelper: false,

    startDate: item.start_date,
    startTime: item.start_time,
    endDate: item.end_date,
    endTime: item.end_time,

    eventAddress: item.event_address,
    addressHelper: "",
    addressBorder: Constants.Inverse,
    showAddressHelper: false,

    price: item.event_entrance_fee,
    priceHelper: "",
    priceBorder: Constants.Inverse,
    showPriceHelper: false,

    phone: item.contact_phone,
    phoneHelper: "",
    phoneBorder: Constants.Inverse,
    showPhoneHelper: false,

    url: item.redirectUrl,
    urlHelper: "",
    urlBorder: Constants.Inverse,
    showUrlHelper: false,

    description: item.event_description,
    descHelperText: "",
    descBorder: Constants.Inverse,
    showDescHelper: false,

    latitude: item.address_latitude,
    latitudeHelper: "",
    latBorder: Constants.Inverse,
    showLatitudeHelper: false,

    longitude: item.address_longitude,
    logitudeHelper: "",
    longitudeBorder: Constants.Inverse,
    showLongitudeHelper: false,

    Updating: false,

    errorContainer: false,
    errorMessage: "",
  });

  const [image, setImage] = useState(featuredImageUri + item.event_image); //state for image which is displayed when user select image
  const [imageName, setImageName] = useState(item.event_image); // state which save the image name which is sent to server and stored inside the database
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(item.start_date);
  const [startTime, setStartTime] = useState(TimeFun(item.start_time));
  const [endingDate, setEndingDate] = useState(new Date());
  const [endMode, setEndMode] = useState("date");
  const [showit, setShowit] = useState(false);
  const [endDate, setEndDate] = useState(item.end_date);
  const [endTime, setEndTime] = useState(TimeFun(item.end_time));
  const [inputs, setInputs] = React.useState({
    startDateBorder: Constants.Secondary,
    startTimeborder: Constants.Secondary,
    endDateBorder: Constants.Secondary,
    endTimeBoarder: Constants.Secondary,
    imageBoarder: Constants.Inverse,
    imageLoader: "notLoading",
  });

  /********************************************* */
  // Image Update section
  /******************************************** */
  //we call the following function when user presses the image place holder in add event screen
  const selectFeaturedImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // ImagePicker saves the taken photo to disk and returns a local URI to it

    let localUri = result.uri; // local image uri
    let filename = localUri.split("/").pop(); // the filename is stored in filename variable

    //if the image selection process doesn't cancelled the statement inside the if condition is executed
    if (!result.cancelled) {
      setImage(localUri);
      setImageName(filename);
      setInputs({
        ...inputs,
        imageLoader: "loading",
      });
    }

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let kind = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    // all image properties needed by server is going to be appended in formdata object
    formData.append("photo", { uri: localUri, name: filename, type: kind });
    //the url which the image will be sent to
    var ApiUrl = Connection.url + Connection.upload;

    return await fetch(ApiUrl, {
      method: "POST", //request method
      body: formData, // data to be sent to server
      headers: {
        "content-type": "multipart/form-data", // header type must be 'multipart/form-data' inorder to send image to server
      },
    })
      .then((response) => response.json()) //check response type of the API
      .then((response) => {
        let message = response[0].message;
        if (message === "successfully uploaded!") {
          setInputs({
            ...inputs,
            imageBoarder: Constants.Success,
            imageLoader: "loaded",
          });
        } else {
          setInputs({
            ...inputs,
            imageBoarder: Constants.Danger,
            imageLoader: "loading",
          });
        }
      });
  };

  /******************************************* */
  // a code to select event start Date and time
  /**************************************** */
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

  /*************************************************** */
  //event title section
  /************************************************** */
  const nameChange = (text) => {
    if (text.length == 0) {
      setInitialValue({
        ...initialValue,
        title: text,
        titleHelper: "Enter event name",
        titleBorder: Constants.red,
        showTitleHelper: true,
      });
    } else if (text.length < 2) {
      setInitialValue({
        ...initialValue,
        title: text,
        titleHelper: "One letters cannot be event name",
        titleBorder: Constants.red,
        showTitleHelper: true,
      });
    } else if (text.length >= 80) {
      setInitialValue({
        ...initialValue,
        title: text,
        titleHelper: "Event name cannot exceed 80 letters",
        titleBorder: Constants.red,
        showTitleHelper: true,
      });
    } else {
      setInitialValue({
        ...initialValue,
        title: text,
        titleHelper: "",
        titleBorder: Constants.Inverse,
        showTitleHelper: false,
      });
    }
  };

  /************************************************** */
  //Event Organizer
  /************************************************* */
  const updateOranizer = (org) => {
    if (org.length == 0) {
      setInitialValue({
        ...initialValue,
        organizer: org,
        orgBorder: Constants.Danger,
        orgHelper: "Please fill organizer name",
        showOrgHelper: true,
      });
    } else if (org.length >= 40) {
      setInitialValue({
        ...initialValue,
        organizer: org,
        orgBorder: Constants.Danger,
        orgHelper: "Event address can not exceed 40 characters!",
        showOrgHelper: true,
      });
    } else {
      setInitialValue({
        ...initialValue,
        organizer: org,
        orgBorder: Constants.Danger,
        orgHelper: "",
        showOrgHelper: false,
      });
    }
  };
  /************************************************* */
  //event address section
  /************************************************ */
  const updateEventAdress = (address) => {
    if (address.length < 3) {
      setInitialValue({
        ...initialValue,
        eventAddress: address,
        addressBorder: Constants.Danger,
        addressHelper: "Event address can not be less than three letter!",
        showAddressHelper: true,
      });
    } else if (address.length >= 40) {
      setInitialValue({
        ...initialValue,
        eventAddress: address,
        addressBorder: Constants.Danger,
        addressHelper: "Event address can not exceed 40 characters!",
        showAddressHelper: true,
      });
    } else {
      setInitialValue({
        ...initialValue,
        eventAddress: address,
        addressBorder: Constants.Inverse,
        addressHelper: "",
        showAddressHelper: false,
      });
    }
  };

  /*************************************************** */
  //enrance fee
  /*************************************************** */
  const updateEntranceFee = (price) => {
    if (price.length == 0) {
      setInitialValue({
        ...initialValue,
        price: price,
        priceBorder: Constants.Danger,
        priceHelper: "If event entrace is FREE enter 0",
        showPriceHelper: true,
      });
    } else {
      setInitialValue({
        ...initialValue,
        price: price,
        priceBorder: Constants.Inverse,
        priceHelper: "",
        showPriceHelper: false,
      });
    }
  };

  /************************************************* */
  //contact phone number
  /************************************************ */
  const updateContactPhone = (phone) => {
    if (phone.length <= 3) {
      setInitialValue({
        ...initialValue,
        phone: phone,
        phoneBorder: Constants.Danger,
        phoneHelper: "To short to be phone number",
        showPhoneHelper: true,
      });
    } else {
      setInitialValue({
        ...initialValue,
        phone: phone,
        phoneBorder: Constants.Inverse,
        phoneHelper: "",
        showPhoneHelper: false,
      });
    }
  };

  /*************************************************** */
  //event location latitude
  /************************************************** */
  const UpdateLatitude = (lat) => {
    setInitialValue({
      ...initialValue,
      latitude: lat,
    });
  };

  /*************************************************** */
  //event location Longitude
  /************************************************** */
  const UpdateLongitude = (long) => {
    setInitialValue({
      ...initialValue,
      longitude: long,
    });
  };

  /*************************************************** */
  //event Rifferal links
  /************************************************** */
  const UpdateLink = (link) => {
    setInitialValue({
      ...initialValue,
      url: link,
    });
  };

  /**************************************************** */
  //event description
  /**************************************************** */
  const EventDescription = (desc) => {
    if (desc.length <= 15) {
      setInitialValue({
        ...initialValue,
        description: desc,
        descBorder: Constants.Danger,
        descHelperText: "Make sure event Description is more than 15 letters",
        showDescHelper: true,
      });
    } else if (desc.length >= 5000) {
      setInitialValue({
        ...initialValue,
        description: desc,
        descBorder: Constants.Danger,
        descHelperText: "Event Description cannot be more than 5000 letters",
        showDescHelper: true,
      });
    } else {
      setInitialValue({
        ...initialValue,
        description: desc,
        descBorder: Constants.Inverse,
        descHelperText: "",
        showDescHelper: false,
      });
    }
  };

  /**************************************************** */
  //update event function
  /**************************************************** */

  const EventUpdate = async () => {
    setInitialValue({
      ...initialValue,
      Updating: true,
    });
    const controller = new AbortController();
    const signal = controller.signal;

    let userId = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.updateEvent;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      eventId: item.event_id,
      userId: userId,
      poster: imageName,
      title: initialValue.title,
      organizer: initialValue.organizer,
      SDate: initialValue.startDate,
      STime: initialValue.startTime,
      EDate: initialValue.endDate,
      ETime: initialValue.endTime,
      Address: initialValue.eventAddress,
      fee: initialValue.price,
      phone: initialValue.phone,
      latitude: initialValue.latitude,
      longitude: initialValue.longitude,
      link: initialValue.url,
      description: initialValue.description,
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
          setInitialValue({
            ...initialValue,
            Updating: false,
          });
          navigation.navigate("Update Succeed");
        } else {
          setInitialValue({
            ...initialValue,
            Updating: false,
          });
        }
      })
      .catch((error) => {
        // setResponse(message);
        setInitialValue({
          ...initialValue,
          Updating: false,
        });
        setInitialValue({
          ...initialValue,
          errorContainer: true,
          errorMessage: "Error updating event!",
        });
      });

    return () => {
      controller.abort();
    };
  };

  /*************************************************** */
  //Event got cancelled
  /*************************************************** */
const checkCancellation = ()=>{
  var status;
   if(item.cancelled == 1){
    status ="Cancelled";
   }
   else {
    status ="Cancel Event";
   }
   return status;
}

  const [cancelButton, setCancelButton] = useState({
    cancelling: false,
    linethrough: false,
    cancelText: checkCancellation(),
    btnDisabled: false,
  });

  const Cancelled = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    setCancelButton({
      ...cancelButton,
      cancelling: true,
      btnDisabled: true,
    });

    let userId = await AsyncStorage.getItem("userId");

    var ApiUrl = Connection.url + Connection.Cancelled;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      userId: userId,
      eventId: item.event_id,
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
          setCancelButton({
            ...cancelButton,
            cancelling: false,
            linethrough: true,
            cancelText: "Cancelled",
            btnDisabled: true,
          });
          setInitialValue({
            ...initialValue,
            errorContainer: false,
            errorMessage: "",
          });
        } else {
          setCancelButton({
            ...cancelButton,
            cancelling: false,
            linethrough: false,
            cancelText: "Cancel Event",
            btnDisabled: false,
          });
          setInitialValue({
            ...initialValue,
            errorContainer: true,
            errorMessage: "Unable to cancel event!",
          });
        }
      })
      .catch((error) => {
        setCancelButton({
          ...cancelButton,
          cancelling: false,
          linethrough: false,
          cancelText: "Cancel Event",
          btnDisabled: false,
        });
        setInitialValue({
          ...initialValue,
          errorContainer: true,
          errorMessage: "Error cancelling event!",
        });
        console.log(error);
      });

    return () => {
      controller.abort();
    };
  };

  //function to close error container
  const closeError = () => {
    setInitialValue({
      ...initialValue,
      errorContainer: false,
    });
  };

  useEffect(() => {
    checkCancellation();
    return () => {};
  });

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
            source={{ uri: image }} //featured image source
            resizeMode="cover"
            style={styles.image} //featured image styles
          />

          {inputs.imageLoader === "loading" ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="small" color={Constants.primary} />
              <Text style={styles.loadingText}>Updating...</Text>
            </View>
          ) : inputs.imageLoader === "loaded" ? (
            <View style={styles.activityIndicator}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={Constants.Success}
              />
              <Text style={styles.loadingText}>Updated</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.topContainer}>
          <TouchableNativeFeedback onPress={() => selectFeaturedImage()}>
            <View style={styles.updatePoster}>
              <Text style={styles.updateText}>Update Poster</Text>
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback
            onPress={() => Cancelled()}
            disabled={cancelButton.btnDisabled}
          >
            <View style={styles.cancelEvent}>
              {cancelButton.cancelling ? (
                <ActivityIndicator size="small" color={Constants.red} />
              ) : (
                <View style={{flexDirection:"row", alignItems:"center"}}>
                  {cancelButton.cancelText === "Cancelled" ? (
                  <MaterialCommunityIcons
                    name="cancel"
                    size={18}
                    color={Constants.Danger}
                    style={{marginRight:4,}}
                  />
                 
                ) : null}
                <Text style={[styles.cancelText]}>
                  {cancelButton.cancelText}
                  
                </Text>
                
                 </View>
              )}
              
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={[
              styles.eventName,
              { borderColor: initialValue.titleBorder },
            ]}
            numberOfLines={1}
            value={initialValue.title}
            onChangeText={(text) => nameChange(text)}
          />
          {initialValue.showTitleHelper ? (
            <HelperText style={{ color: Constants.Danger }}>
              {initialValue.titleHelper}
            </HelperText>
          ) : null}
        </View>

        {/* event organizer field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Event Organizer</Text>
          <TextInput
            value={initialValue.organizer}
            onChangeText={(org) => updateOranizer(org)}
            style={[styles.eventName, { borderColor: initialValue.orgBorder }]}
          />
          {initialValue.showOrgHelper ? (
            <HelperText style={{ color: Constants.Danger }}>
              {initialValue.orgHelper}
            </HelperText>
          ) : null}
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
            onChangeText={(address) => updateEventAdress(address)}
            style={[
              styles.eventName,
              { borderColor: initialValue.addressBorder },
            ]}
          />
          {initialValue.showAddressHelper ? (
            <HelperText style={{ color: Constants.Danger }}>
              {initialValue.addressHelper}
            </HelperText>
          ) : null}
        </View>

        {/* entrance fee */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Entrance fee (ETB)</Text>
          <TextInput
            value={initialValue.price}
            onChangeText={(price) => updateEntranceFee(price)}
            style={[
              styles.eventName,
              { borderColor: initialValue.priceBorder },
            ]}
            keyboardType="phone-pad"
          />
          {initialValue.showPriceHelper ? (
            <HelperText style={{ color: Constants.Danger }}>
              {initialValue.priceHelper}
            </HelperText>
          ) : null}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Contact Phone</Text>
          <TextInput
            value={initialValue.phone}
            onChangeText={(phone) => updateContactPhone(phone)}
            style={styles.eventName}
            keyboardType="phone-pad"
          />
          {initialValue.showPhoneHelper ? (
            <HelperText style={{ color: Constants.Danger }}>
              {initialValue.phoneHelper}
            </HelperText>
          ) : null}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Map Latitude</Text>
          <TextInput
            value={initialValue.latitude}
            onChangeText={(lat) => UpdateLatitude(lat)}
            style={styles.eventName}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Map Longitude</Text>
          <TextInput
            value={initialValue.longitude}
            onChangeText={(long) => UpdateLongitude(long)}
            style={styles.eventName}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Link</Text>
          <TextInput
            value={initialValue.url}
            onChangeText={(link) => UpdateLink(link)}
            style={styles.eventName}
          />
        </View>

        {/* event description */}

        <View style={styles.descContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            // a text field used accept event description
            placeholder="Write Your Event Description"
            multiline
            numberOfLines={4}
            style={[
              styles.description,
              { borderColor: initialValue.descBorder },
            ]}
            value={initialValue.description}
            onChangeText={(desc) => EventDescription(desc)}
            // onBlur={() => desHideHelperText()}
          />
          {initialValue.showDescHelper ? (
            <HelperText style={{ color: Constants.Danger }}>
              {initialValue.descHelperText}
            </HelperText>
          ) : null}
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

      {initialValue.errorContainer ? (
        <Animatable.View
          animation="fadeInUpBig"
          duration={0.3}
          style={styles.errorPrompt}
        >
          <TouchableOpacity
            onPress={() => closeError()}
            style={styles.closePrompt}
          >
            <Ionicons name="close" size={25} color={Constants.background} />
          </TouchableOpacity>
          <Text style={styles.promptText}>{initialValue.errorMessage}</Text>
        </Animatable.View>
      ) : null}

      <TouchableNativeFeedback onPress={() => EventUpdate()}>
        <View style={styles.updateButton}>
          {initialValue.Updating ? (
            <ActivityIndicator size="small" color={Constants.light} />
          ) : (
            <Text style={styles.confirmUpdate}>Update</Text>
          )}
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
    paddingHorizontal: 15,
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
    paddingHorizontal: 40,
  },
  confirmUpdate: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
  },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 2,
    paddingRight: 4,
  },
  activityIndicator: {
    flexDirection: "row",
    padding: 5,
  },
  loadingText: {
    marginLeft: 6,
    color: Constants.Inverse,
  },
  closePrompt: {
    position: "absolute",
    right: 15,
    top: 5,
  },
  promptText: {
    color: Constants.background,
    fontWeight: Constants.Bold,
  },
  errorPrompt: {
    position: "absolute",
    bottom: 50,
    zIndex: 100,
    width: "85%",
    backgroundColor: Constants.Danger,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: Constants.tiny,
    elevation: 4,
    shadowColor: Constants.Secondary,
    shadowOffset: {
      height: 8,
      width: 2,
    },
  },
});

//make this component available to the app
export default UpdateEvent;
