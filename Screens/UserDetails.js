//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Caption, HelperText, Title } from "react-native-paper";
import Constants from "../constants/Constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Fontisto, AntDesign, Ionicons } from "react-native-vector-icons";
import { RadioButton } from "react-native-paper";
import Category from "../src/Category";
import Connection from "../constants/connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";

// create a component
const UserDetails = ({ route, navigation }) => {
  const { detailInfo } = route.params;
  const [MetaInfo, setMetaInfo] = React.useState({
    firstName: detailInfo.first_name,
    middleName: detailInfo.middle_name,
    lastName: detailInfo.last_name,
    userName: detailInfo.username,
    Phone: detailInfo.phone,
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [googleId, setGoogleId] = useState(detailInfo.google_Id);
  //Message from server
  const [message, setMessage] = useState("Success");
  const [showMessage, setShowMesssage] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false); // date modal state
  const [startDate, setStartDate] = useState(detailInfo.birthdate); //birthDate state
  const [checked, setChecked] = useState("Male"); //gender state

  const [category, setCategory] = useState(detailInfo.category);
  const [modalVisible, setModalVisible] = useState(false); // category modal state

  const [inputs, setInputs] = useState({
    startDateBorder: Constants.Faded,
    startDateCheckIcon: false,
  });

  //update user first name
  const editFirstName = (val) => {
    setMetaInfo({
      ...MetaInfo,
      firstName: val,
    });
  };
  //update user middle name
  const editMiddleName = (val) => {
    setMetaInfo({
      ...MetaInfo,
      middleName: val,
    });
  };
  //update user last name
  const editLastName = (val) => {
    setMetaInfo({
      ...MetaInfo,
      lastName: val,
    });
  };

  //select user Birth date
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

    setStartDate(startDate);

    if (startDate) {
      setInputs({
        ...inputs,
        startDateBorder: Constants.Success,
        startDateCheckIcon: true,
      });
    } else {
      setInputs({
        ...inputs,
        startDateBorder: Constants.Faded,
        startDateCheckIcon: false,
      });
    }
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  /****************************************************** */
  //organizing name or username related operation goes here
  /****************************************************** */
  const updateUsername = (val) => {
    setMetaInfo({
      ...MetaInfo,
      userName: val,
    });
  };
  /**************************************************** */
  //rendered category list which i shown in the modal when user click on slect catory button
  /**************************************************** */
  const [catback, setCatBack] = useState(Constants.purple);

  const OnSelectCategory = (itemName, background) => {
    setCategory(itemName);
    setCatBack(background);
    setModalVisible(false);
  };
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.CategoryList, {backgroundColor: item.background}]}
      onPress={() => OnSelectCategory(item.name, item.background)}
    >
      <Text style={styles.catName}>{item.name}</Text>
    </TouchableOpacity>
  );
  /*************************************************** */
  //phone related operations
  /************************************************** */

  const updatePhone = (val) => {
    setMetaInfo({
      ...MetaInfo,
      Phone: val,
    });
  };

  //we trigger Save button
  const [updating, setUpdating] = useState(false);

  const SaveUserInfo = async () => {
    setUpdating(true);
    var userId = await AsyncStorage.getItem("userId");
    var ApiUrl = Connection.url + Connection.updateUserInfo;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var data = {
      userId: userId,
      firstName: MetaInfo.firstName,
      middleName: MetaInfo.middleName,
      lastName: MetaInfo.lastName,
      birthDate: startDate,
      gender: checked,
      username: MetaInfo.userName,
      category: category,
      Phone: MetaInfo.Phone,
    };
    //save user info into database
    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        var resp = response[0];

        if (resp.message === "successfully updated") {
          var serverResponse = resp.message;

          setShowMesssage(true);
          setMessage(serverResponse);
          setUpdating(false);
        } else {
          setUpdating(false);
        }
      });
  };

  //user asked old password
  const updateOldPassword = (pass) => {
    setMetaInfo({
      ...MetaInfo,
      oldPassword: pass,
    });
  };
  //user asked new password
  const updateNewPassword = (pass) => {
    setMetaInfo({
      ...MetaInfo,
      password: pass,
    });
  };
  //user asked to confirm password
  const updateConfirmedPassword = (pass) => {
    setMetaInfo({
      ...MetaInfo,
      confirmPassword: pass,
    });

    if (pass !== MetaInfo.password) {
      setError({
        ...error,
        errorMessage: "Password Doesn't match!",
      });
    } else if (pass === MetaInfo.password) {
      setError({
        ...error,
        errorMessage: "",
      });
    } else {
      setError({
        ...error,
        errorMessage: "",
      });
    }
  };

  //password change error indicator field
  const [error, setError] = useState({
    oldPasswordBorder: Constants.Faded,
    setPasswordBorder: Constants.Faded,
    confirmPasswordBorder: Constants.Faded,
    errorMessage: "",
    messageColor: Constants.Danger,
  });
  /******************************************************* */
  //changing password
  /****************************************************** */

  //activity indicator for change password button

  const [updatePassword, setUpdatePassword] = useState(false);

  //function to be called when change password button get clicked

  const ChangePassword = () => {
    setUpdatePassword(true);
    var userId = detailInfo.userId;
    var ApiUrl = Connection.url + Connection.ChangePassword;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var data = {
      userId: userId,
      oldPassword: MetaInfo.oldPassword,
      newPassword: MetaInfo.confirmPassword,
    };
    if(MetaInfo.oldPassword.length === 0){
      setError({
        ...error,
        errorMessage: "Please enter your old password"
      })
      setUpdatePassword(false);
    }
    else if(MetaInfo.password.length === 0){
      setError({
        ...error,
        errorMessage: "Please enter your new password"
      })
      setUpdatePassword(false);
    }
    else if(MetaInfo.confirmPassword.length === 0){
      setError({
        ...error,
        errorMessage: "Please confirm the password"
      })
      setUpdatePassword(false);
    }
    else {
      
    
      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          var backendResponse = response[0].message;
          if (backendResponse === "Password Updated") {
            setError({
              ...error,
              errorMessage: "Password Updated Successfully!",
              messageColor: Constants.Success,
            });
            setUpdatePassword(false);
          } else {
            setError({
              ...error,
              errorMessage: backendResponse,
              messageColor: Constants.Danger,
            });
            setUpdatePassword(false);
          }
        });
      }
  };

  useEffect(() => {
 
    return () => {};
  });

  return (

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {showMessage ? (
          <Animatable.View
            animation="fadeInDown"
            delay={500}
            style={styles.updatePrompt}
          >
            <Text style={styles.promptText}>{message}</Text>
            <Pressable onPress={() => setShowMesssage(false)}>
              <AntDesign
                name="closecircle"
                size={24}
                color={Constants.background}
                style={styles.closeBtn}
              />
            </Pressable>
          </Animatable.View>
        ) : null}

        <View style={styles.subContainerOne}>
          <TextInput
            placeholder="First Name"
            style={styles.inpuFields}
            value={MetaInfo.firstName}
            onChangeText={(val) => editFirstName(val)}
          />
          <TextInput
            placeholder="Middle Name"
            style={[styles.inpuFields]}
            value={MetaInfo.middleName}
            onChangeText={(val) => editMiddleName(val)}
          />
        </View>

        <View style={styles.subContainerTwo}>
          <TextInput
            placeholder="Last Name"
            style={[styles.inpuFields]}
            value={MetaInfo.lastName}
            onChangeText={(val) => editLastName(val)}
          />
        </View>

        <View
          //divider
          style={{
            width: "94%",
            height: 2,
            backgroundColor: Constants.transparentPrimary,
            marginTop: 10,
          }}
        />
        {
          //third mini container which contains user birthdate
        }
        <View style={styles.subContainerThree}>
          <View>
            <HelperText>Your Birth Date</HelperText>
          </View>
          <View style={styles.birthDate}>
            <Fontisto
              name="date"
              size={22}
              color={Constants.primary}
              style={styles.dateIcon}
            />
            <TouchableOpacity
              onPress={() => showMode("date")}
              style={styles.selectDateBtn}
            >
              <Text style={styles.selectDateTxt}> {startDate}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            display="default"
            collapsable={true}
            onChange={onChange}
          />
        )}

        <View style={styles.subContainerFour}>
          <View style={styles.fourOne}>
            <Text style={styles.genderTitle}>Gender</Text>
          </View>

          <View style={styles.fourTwo}>
            <Text style={styles.genderLabel}> Male</Text>

            <RadioButton
              value="Male"
              status={checked === "Male" ? "checked" : "unchecked"}
              onPress={() => setChecked("Male")}
              color={Constants.primary}
            />
          </View>

          <View style={styles.fourThree}>
            <Text style={styles.genderLabel}> Female</Text>
            <RadioButton
              value="Female"
              status={checked === "Female" ? "checked" : "unchecked"}
              onPress={() => setChecked("Female")}
              color={Constants.primary}
            />
          </View>
        </View>
       
 {
          //update username
        }
        <View style={styles.usernameUpdate}>
          <Caption>Organizer Name</Caption>
          <TextInput
            placeholder="Ex: Afromina Events"
            style={styles.username}
            value={MetaInfo.userName}
            onChangeText={(val) => updateUsername(val)}
          />
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
                  name="closecircle"
                  size={24}
                  color={Constants.Inverse}
                  style={styles.closeBtn}
                />
              </Pressable>
              <Text style={styles.modalTitle}>Category list</Text>

              <FlatList
                data={Category}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                style={styles.catFlatlist}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </Modal>

          <Caption style={{marginLeft:15, marginTop:10,marginBottom:-5, padding:0}}>Select Your Prefered Category</Caption>
          <Pressable
            //Button which open the category modal
            style={[styles.catSelector,{backgroundColor:catback}]}
            onPress={() => setModalVisible(true)}
          >
          
            <Text style={[styles.selectedCategory]}>{category}</Text>
            <Ionicons name="list-outline" size={22} color={Constants.background} />
          </Pressable>
        </View>

        {
          //user phone number
        }
        <View style={styles.userPhoneNumber}>
          <Caption>Phone Number</Caption>
          <TextInput
            placeholder="09********"
            style={styles.phone}
            value={MetaInfo.Phone}
            onChangeText={(val) => updatePhone(val)}
          />
        </View>

        <Pressable onPress={() => SaveUserInfo()} style={styles.saveBtn}>
          {updating ? (
            <ActivityIndicator size="small" color={Constants.background} />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </Pressable>
{
  googleId.length == 0  ? null
  :
  (
    
    <View style={styles.updatePasswords}>
    <Text style={styles.changePasswordTitle}>Change Password</Text>
    <HelperText
      style={[styles.errorMessageStyle, { color: error.messageColor }]}
    >
      {error.errorMessage}
    </HelperText>

    <TextInput
      placeholder="Old Password"
      value={MetaInfo.oldPassword}
      onChangeText={(pass) => updateOldPassword(pass)}
      style={styles.pass}
    />
    <TextInput
      placeholder="New Password"
      value={MetaInfo.password}
      onChangeText={(pass) => updateNewPassword(pass)}
      style={styles.pass}
    />
    <TextInput
      placeholder="Confirm New Password"
      value={MetaInfo.confirmPassword}
      onChangeText={(pass) => updateConfirmedPassword(pass)}
      style={styles.pass}
    />
    <Pressable onPress={() => ChangePassword()} style={styles.updatepassword}>
   
   {updatePassword ? (
     <ActivityIndicator size="small" color={Constants.background} />
   ) :  <Text style={styles.saveText}>Change Password</Text>}
 </Pressable>
  </View>

  )
}
      </ScrollView>

  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.background,
  },
  scrollContainer: {
    alignItems: "center",
    backgroundColor: Constants.background,
    minHeight:"100%"
  },
  accountSettingHead: {
    color: Constants.Secondary,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  subContainerOne: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "96%",
    marginTop: 10,
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    backgroundColor: Constants.background,
  },
  inpuFields: {
    width: "46%",
    backgroundColor: Constants.Faded,
    margin: 8,
    borderRadius: Constants.tinybox,
    paddingLeft: 15,
    padding: 5,
    borderWidth: 0.4,
    borderColor: Constants.purple
  },
  subContainerTwo: {
    width: "96%",
    marginTop: 10,
    backgroundColor: Constants.background,
  },
  subContainerThree: {
    flexDirection: "column",
    alignSelf: "flex-start",
    width: "45%",
    margin: 15,
    marginTop: 10,
    paddingLeft: 5,
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    borderWidth: 0.4,
    borderColor: Constants.purple
  },
  birthDate: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
 
  },
  dateIcon: {
    marginHorizontal: 15,
  },
  checkIcon: {
    position: "absolute",
    right: 10,
  },
  //styles for gender selector radio button
  subContainerFour: {
    width: "96%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.mediumbox,
    padding: 10,
    marginLeft: 10,
  },
  genderTitle: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
  genderLabel: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Secondary,
  },
  fourOne: {
    // first view container of gender View container
  },
  fourTwo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  fourThree: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    width: "96%",
    alignSelf: "flex-start",
    marginLeft: 5,
    justifyContent: "center",
  },
  catSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
    backgroundColor: Constants.Faded,
    padding: 10,
    margin: 10,
    borderRadius: Constants.tinybox,
   
  },
  selectedCategory: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.background,
    paddingLeft: 4,
  },
  catModal: {
    width: "96%",
    backgroundColor: Constants.background,
    justifyContent: "center",
    alignItems: "center",
  },
  Categories: {
    width: "96%",
    height: "90%",
    backgroundColor: Constants.Faded,
    alignSelf: "center",
    marginTop: 80,

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
    fontSize: Constants.headingone,
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
    color:Constants.background
  },
  userPhoneNumber: {
    width: "91.5%",

   // paddingHorizontal: 5,
  },
  phone: {
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    padding: 8,
    paddingHorizontal: 20,
    fontSize: Constants.headingtwo,
    borderWidth:0.4,
    borderColor:Constants.purple
  },

  // username related styling
  usernameUpdate: {
    width: "91.5%",
    borderRadius: Constants.mediumbox,
    //paddingHorizontal: 5,
    marginTop: 10,

  },
  username: {
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tinybox,
    padding: 8,
    paddingHorizontal: 20,
    fontSize: Constants.headingtwo,
    borderWidth:0.4,
    borderColor:Constants.purple
  },
  saveBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    marginVertical: 20,
    padding: 8,
    paddingHorizontal: 30,
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    marginRight: 18,
  },
  updatepassword:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    marginVertical: 20,
    padding: 8,
    paddingHorizontal: 30,
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    marginRight: 1,
  },
  saveText: {
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    color: Constants.background,
  },
  // change password section
  updatePasswords: {
    width: "94%",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.mediumbox,
    padding: 8,
    paddingHorizontal: 15,
    marginTop: 5,
    
    
  },
  pass: {
    backgroundColor: Constants.background,
    borderRadius: Constants.tinybox,
    padding: 8,
    paddingHorizontal: 20,
    fontSize: Constants.headingthree,
    marginTop: 8,
    borderWidth:0.4,
    borderColor:Constants.purple
  },
  updatePrompt: {
    position: "absolute",
    top: 10,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: Constants.tiny,
    backgroundColor: Constants.Success,
  },
  promptText: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingone,
    fontFamily: Constants.fontFam,
    color: Constants.background,
    marginRight: 40,
  },
  //change password title
  changePasswordTitle: {
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingone,
    color: Constants.Inverse,
  },
  errorMessageStyle: {
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingthree,
    color: Constants.Danger,
  },
});

//make this component available to the app
export default UserDetails;
