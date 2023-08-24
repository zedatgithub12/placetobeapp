//import liraries
import React, { useEffect, useState } from "react";
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
  Dimensions,
} from "react-native";
import { Caption, Divider, HelperText } from "react-native-paper";
import Constants from "../../constants/Constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign, Ionicons } from "react-native-vector-icons";
import { RadioButton } from "react-native-paper";
import Category from "../../data/Category";
import Connection from "../../constants/connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../Utils/Toast";
import { useTheme } from "@react-navigation/native";

// create account setting component
const UserDetails = ({ route, navigation }) => {
  const { detailInfo } = route.params;

  const { theme } = useTheme();

  const [MetaInfo, setMetaInfo] = React.useState({
    firstName: detailInfo.first_name ? detailInfo.first_name : "",
    middleName: detailInfo.middle_name ? detailInfo.middle_name : "",
    lastName: detailInfo.last_name ? detailInfo.last_name : "",
    userName: detailInfo.username ? detailInfo.username : "",
    Phone: detailInfo.phone ? detailInfo.phone : "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [googleId, setGoogleId] = useState(detailInfo.google_Id);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false); // date modal state
  const [startDate, setStartDate] = useState(
    detailInfo.birthdate ? detailInfo.birthdate : ""
  ); //birthDate state
  const [checked, setChecked] = useState(
    detailInfo.gender ? detailInfo.gender : ""
  ); //gender state

  const [category, setCategory] = useState(
    detailInfo.category ? detailInfo.category : ""
  );
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
      style={[styles.CategoryList, {}]}
      onPress={() => OnSelectCategory(item.name, item.background)}
    >
      <Text style={[styles.catName, { color: item.background }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  /*************************************************** */
  //phone number related operations
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
    var ApiUrl = Connection.url + Connection.updateUserInfo + userId;
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
      category: category,
      Phone: MetaInfo.Phone,
    };
    //save user info into database
    fetch(ApiUrl, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setUpdating(false);
          showToast("Successfully updated!");
        } else {
          setUpdating(false);
          showToast("Please try again later");
        }
      })
      .catch((error) => {
        showToast("Error updating");
      });
  };

  const updateOldPassword = (pass) => {
    setMetaInfo({
      ...MetaInfo,
      oldPassword: pass,
    });
  };

  const updateNewPassword = (pass) => {
    setMetaInfo({
      ...MetaInfo,
      password: pass,
    });
  };

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

  const [error, setError] = useState({
    oldPasswordBorder: Constants.Faded,
    setPasswordBorder: Constants.Faded,
    confirmPasswordBorder: Constants.Faded,
    errorMessage: "",
    messageColor: Constants.Danger,
  });

  const [updatePassword, setUpdatePassword] = useState(false);

  const ChangePassword = () => {
    setUpdatePassword(true);

    if (MetaInfo.oldPassword.length === 0) {
      setError({
        ...error,
        errorMessage: "Please enter your old password",
        messageColor: Constants.Danger,
      });
      setUpdatePassword(false);
    } else if (MetaInfo.password.length === 0) {
      setError({
        ...error,
        errorMessage: "Please enter your new password",
        messageColor: Constants.Danger,
      });
      setUpdatePassword(false);
    } else if (MetaInfo.confirmPassword.length === 0) {
      setError({
        ...error,
        errorMessage: "Please confirm the password",
        messageColor: Constants.Danger,
      });
      setUpdatePassword(false);
    } else if (
      MetaInfo.confirmPassword.length === MetaInfo.oldPassword.length
    ) {
      setError({
        ...error,
        errorMessage: "The old and confirmed password are same",
        messageColor: Constants.Danger,
      });
      setUpdatePassword(false);
    } else {
      var id = detailInfo.id;
      var ApiUrl = Connection.url + Connection.ChangePassword + id;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      var data = {
        oldPassword: MetaInfo.oldPassword,
        newPassword: MetaInfo.confirmPassword,
      };

      fetch(ApiUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            setError({
              ...error,
              errorMessage: response.message,
              messageColor: theme.success.main,
            });
            setUpdatePassword(false);
          } else {
            setError({
              ...error,
              errorMessage: response.message,
              messageColor: Constants.Danger,
            });
            setUpdatePassword(false);
          }
        })
        .catch((error) => {
          setError({
            ...error,
            errorMessage: "There is error updating password",
            messageColor: Constants.Danger,
          });
          setUpdatePassword(false);
        });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: theme.background.darker },
      ]}
    >
      <View style={styles.subContainerOne}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          placeholder="First Name"
          style={styles.inpuFields}
          value={MetaInfo.firstName}
          onChangeText={(val) => editFirstName(val)}
        />
      </View>
      <View style={styles.subContainerOne}>
        <Text style={styles.label}>Middle name</Text>
        <TextInput
          placeholder="Middle Name"
          style={[styles.inpuFields]}
          value={MetaInfo.middleName}
          onChangeText={(val) => editMiddleName(val)}
        />
      </View>

      <View style={styles.subContainerTwo}>
        <Text style={styles.label}>Last name</Text>
        <TextInput
          placeholder="Last Name"
          style={[styles.inpuFields]}
          value={MetaInfo.lastName}
          onChangeText={(val) => editLastName(val)}
        />
      </View>

      <View style={styles.subContainerDate}>
        <Text style={styles.label}>Your Birth Date</Text>

        <View style={styles.inpuFields}>
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
        <Text style={styles.label}>Gender</Text>

        <View style={styles.fourOne}>
          <View style={styles.fourTwo}>
            <Text style={styles.genderLabel}> Male</Text>

            <RadioButton
              value="Male"
              status={checked === "Male" ? "checked" : "unchecked"}
              onPress={() => setChecked("Male")}
              color={theme.primary[600]}
            />
          </View>

          <View style={styles.fourThree}>
            <Text style={styles.genderLabel}> Female</Text>
            <RadioButton
              value="Female"
              status={checked === "Female" ? "checked" : "unchecked"}
              onPress={() => setChecked("Female")}
              color={theme.primary[600]}
            />
          </View>
        </View>
      </View>

      <View style={styles.userPhoneNumber}>
        <Text style={styles.label}>Phone number</Text>
        <TextInput
          placeholder="09********"
          style={styles.inpuFields}
          value={MetaInfo.Phone}
          onChangeText={(val) => updatePhone(val)}
        />
      </View>

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
            <Text style={styles.modalTitle}>Category list</Text>
            <Pressable
              style={styles.closeModal}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AntDesign
                name="close"
                size={20}
                color={Constants.Inverse}
                style={styles.closeBtn}
              />
            </Pressable>

            <FlatList
              data={Category}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              style={styles.catFlatlist}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Modal>

        <Text
          style={[
            styles.label,
            { marginLeft: 10, marginTop: 16, marginBottom: -8, padding: 0 },
          ]}
        >
          Select category
        </Text>
        <Pressable
          //Button which open the category modal
          style={[styles.catSelector, { color: catback, borderColor: catback }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.selectedCategory, { color: catback }]}>
            {category}
          </Text>
          <Ionicons name="list-outline" size={22} color={theme.dark.main} />
        </Pressable>
      </View>

      <Pressable onPress={() => SaveUserInfo()} style={styles.saveBtn}>
        {updating ? (
          <ActivityIndicator size="small" color={Constants.Inverse} />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </Pressable>

      <Divider />

      {!googleId && (
        <View style={styles.updatePasswords}>
          <Text style={styles.changePasswordTitle}>Change Password</Text>
          <Text
            style={[styles.errorMessageStyle, { color: error.messageColor }]}
          >
            {error.errorMessage}
          </Text>

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
          <Pressable
            onPress={() => ChangePassword()}
            style={styles.updatepassword}
          >
            {updatePassword ? (
              <ActivityIndicator size="small" color={Constants.Inverse} />
            ) : (
              <Text style={styles.saveText}>Change Password</Text>
            )}
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    minHeight: "100%",
  },
  accountSettingHead: {
    color: Constants.Secondary,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  subContainerOne: {
    width: Dimensions.get("screen").width / 1.09,
    marginTop: 10,
    borderRadius: Constants.tinybox,
  },
  label: {
    paddingVertical: 6,
    marginTop: 3,
    color: Constants.Inverse,
    fontSize: Constants.textSize,
  },
  inpuFields: {
    width: Dimensions.get("screen").width / 1.09,
    borderRadius: Constants.tinybox,
    padding: 4,
    fontSize: Constants.headingtwo,
    borderBottomWidth: 0.4,
    borderBottomColor: Constants.icon,
  },
  subContainerTwo: {
    marginTop: 10,
  },
  subContainerDate: {
    flexDirection: "column",
    alignSelf: "flex-start",
    margin: 15,
    marginTop: 10,
  },
  birthDate: {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: Constants.tinybox,
    padding: 10,
    fontSize: Constants.headingtwo,
    borderWidth: 0.3,
    borderColor: Constants.Inverse,
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
    width: Dimensions.get("screen").width / 1.09,
    flexDirection: "column",
    borderRadius: 8,
    paddingVertical: 10,
  },
  genderLabel: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
  fourOne: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
    padding: 10,
    margin: 10,
    borderRadius: Constants.tinybox,
    borderWidth: 0.3,
  },
  selectedCategory: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    textTransform: "capitalize",
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
    color: Constants.Inverse,
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
    paddingLeft: 4,
  },
  userPhoneNumber: {
    width: "91.5%",

    // paddingHorizontal: 5,
  },

  saveBtn: {
    width: Dimensions.get("screen").width / 1.1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    padding: 10,
    color: Constants.Inverse,
    borderRadius: Constants.tiny,
    backgroundColor: Constants.primary,
  },
  saveText: {
    fontWeight: Constants.Boldtwo,
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
    textAlign: "center",
  },
  updatepassword: {
    width: Dimensions.get("screen").width / 1.09,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 30,
    padding: 10,
    color: Constants.Inverse,
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
  },

  // change password section
  updatePasswords: {
    borderRadius: Constants.mediumbox,
    padding: 8,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  pass: {
    borderRadius: Constants.tinybox,
    padding: 8,
    paddingHorizontal: 16,
    fontSize: Constants.headingthree,
    marginTop: 8,
    borderBottomWidth: 0.4,
    borderColor: Constants.icon,
  },

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
    marginTop: 4,
    marginBottom: 10,
    paddingLeft: 3,
  },
});

//make this component available to the app
export default UserDetails;
