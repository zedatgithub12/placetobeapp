import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity
} from "react-native";
import {Caption, HelperText, Title } from "react-native-paper";
import Constants from "../constants/Constants";
import { MaterialCommunityIcons,AntDesign,Ionicons } from "react-native-vector-icons";
import { AuthContext } from "./context";
import * as Animatable from "react-native-animatable";
import Category from "../src/Category";

const FormThree = () => {
  // a useContent hook which will treat all input value as global variables
  // the eventproperties variable is declared inside App mathod bacause we need to keep all gloabal varibales in top tree
  // value collect from input field will be access inside Submit event class found in Screens folder
  // while submitting event it will validate the value stored in glabal scope

  const { formThree } = React.useContext(AuthContext);

  const formThreeFields = (
    eventOrganizer,
    eventCategory,
    eventAddress,
    eventEntrance
  ) => {
    formThree(eventOrganizer, eventCategory, eventAddress, eventEntrance);
  };

  const [inputs, setInputs] = React.useState({
    organizer: "",
    orgBorder: Constants.Faded,
    orgCheckIcon: false,
    orgHelperText: "",

    category: "",
    catBorder: Constants.Faded,
    catCheckIcon: false,
    catHelperText: "",

    eventAddress: "",
    eventAddressBorder: Constants.Faded,
    eventAddressCheckIcon: false,
    eventAddressHelperText: "",

    entranceFee: "",
    feeBorder: Constants.Faded,
    feeCheckIcon: false,
    feeHelperText: "",
  });

  // function for to be called when organizer name updated

  const updateOrganizer = (org) => {
    if (org.length <= 4) {
      setInputs({
        ...inputs,
        organizer: org,
        orgBorder: Constants.Danger,
        orgHelperText: " Organizer name cannot be less than 5 letter",
        orgCheckIcon: false,
      });
    } else if (org.length >= 30) {
      setInputs({
        ...inputs,
        organizer: org,
        orgBorder: Constants.Danger,
        orgHelperText: " Organizer name cannot be more than 30 letter",
        orgCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        organizer: org,
        orgBorder: Constants.Success,
        orgHelperText: "",
        orgCheckIcon: true,
      });
    }
  };
  // function for to be called when category field gets updated

  const updateCategory = (cat) => {
    if (cat.length <= 4) {
      setInputs({
        ...inputs,
        category: cat,
        catBorder: Constants.Danger,
        catHelperText: " Category cannot be less than 4 letter",
        catCheckIcon: false,
      });
    } else if (cat.length >= 30) {
      setInputs({
        ...inputs,
        category: cat,
        catBorder: Constants.Danger,
        catHelperText: "Category maximum character length is 30 letter",
        catCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        category: cat,
        catBorder: Constants.Success,
        catHelperText: " ",
        catCheckIcon: true,
      });
    }
  };

  // function for to be called when category field gets updated
  const updateEventAdress = (address) => {
    if (address.length <= 3) {
      setInputs({
        ...inputs,
        eventAddress: address,
        eventAddressBorder: Constants.Danger,
        eventAddressHelperText: "Event Address cannnot less than 4 letter!",
        eventAddressCheckIcon: false,
      });
    } else if (address.length >= 40) {
      setInputs({
        ...inputs,
        eventAddress: address,
        eventAddressBorder: Constants.Danger,
        eventAddressHelperText: "Event address can not exced 35 character!",
        eventAddressCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        eventAddress: address,
        eventAddressBorder: Constants.Success,
        eventAddressHelperText: " ",
        eventAddressCheckIcon: true,
      });
    }
  };

  const updateEntranceFee = (price) => {
    if (price.length == 0) {
      setInputs({
        ...inputs,
        entranceFee: price,
        feeBorder: Constants.Danger,
        feeHelperText: "If event entrace is FREE enter 0",
        feeCheckIcon: false,
      });
    } else {
      setInputs({
        ...inputs,
        entranceFee: price,
        feeBorder: Constants.Success,
        feeHelperText: "",
        feeCheckIcon: true,
      });
    }
  };
  const storeValueGlobalScope = () => {
    formThreeFields(
      inputs.organizer,
      category,
      inputs.eventAddress,
      inputs.entranceFee
    );
  };
  /**************************************************** */
  //rendered category list which i shown in the modal when user click on slect catory button
  /**************************************************** */
  const [category, setCategory] = useState("Select category"); 
  const [modalVisible, setModalVisible] = useState(false);
  const [catCheck, setCatCheck] = useState(false);


  

  const OnSelectCategory = (itemName) => {
    setCategory(itemName);
    setCatCheck(true);
    setModalVisible(false);
  };
  //render category list
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.CategoryList}
      onPress={() => OnSelectCategory(item.name)}
    >
      <Text style={styles.catName}>{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.eventSession}>Event details</Text>
      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 1, borderColor: inputs.orgBorder },
        ]}
      >
        <MaterialCommunityIcons
          name="account-group-outline"
          size={24}
          color={Constants.primary}
        />
        <TextInput
          placeholder="Organizer"
          style={styles.selectDateBtn}
          value={inputs.organizer}
          onChangeText={(org) => updateOrganizer(org)}
          onBlur={() => storeValueGlobalScope()}
        />
        {
          //check button on validation of input field
          inputs.orgCheckIcon ? (
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
        {inputs.orgHelperText}
      </HelperText>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 1, borderColor: inputs.catBorder },
        ]}
      >
        <MaterialCommunityIcons
          name="folder-star-multiple-outline"
          size={24}
          color={Constants.primary}
        />
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
              <Text style={styles.modalTitle}>Category</Text>

              <FlatList
                data={Category}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                style={styles.catFlatlist}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </Modal>

          <Pressable
            //Button which open the category modal
            style={styles.catSelector}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.selectedCategory}>{category}</Text>
            <Ionicons name="chevron-down-outline" size={22} color={Constants.primary} />
          </Pressable>
        </View>

        {/*
          <TextInput
          placeholder="Category"
          style={styles.selectDateBtn}
          value={inputs.category}
          onChangeText={(cat) => updateCategory(cat)}
          onBlur={() => storeValueGlobalScope()}
        />
        */}
        {
          //check button on validation of input field
          catCheck ? (
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
        {inputs.catHelperText}
      </HelperText>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 1, borderColor: inputs.eventAddressBorder },
        ]}
      >
        <MaterialCommunityIcons
          name="map-marker-radius-outline"
          size={24}
          color={Constants.primary}
        />
        <TextInput
          placeholder="Event Address"
          style={styles.selectDateBtn}
          value={inputs.eventAddress}
          onChangeText={(address) => updateEventAdress(address)}
          onBlur={() => storeValueGlobalScope()}
        />
        {
          //check button on validation of input field
          inputs.eventAddressCheckIcon ? (
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
        {inputs.eventAddressHelperText}
      </HelperText>

      <View
        style={[
          styles.eventContentContainer,
          { borderWidth: 1, borderColor: inputs.feeBorder },
        ]}
      >
        <MaterialCommunityIcons
          name="ticket-confirmation-outline"
          size={24}
          color={Constants.primary}
        />
        <TextInput
          placeholder="Entrance fee"
          style={styles.enterEventPrice}
          value={inputs.entranceFee}
          onChangeText={(price) => updateEntranceFee(price)}
          onBlur={() => storeValueGlobalScope()}
          keyboardType="numeric"
        />

        <Text style={styles.TicketPrice}>ETB</Text>
        {
          //check button on validation of input field
          inputs.feeCheckIcon ? (
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
        {inputs.feeHelperText}
      </HelperText>

      <HelperText style={{ marginTop: 30 }}>
        Make sure you have provided all valid informations.
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
    paddingRight: 20,
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
    right: 2,
    paddingRight: 4,
  },
  //category button
  //and category modal selector
  category: {
    width: "96%",
    alignSelf: "flex-start",
    alignItems:"center",
    marginLeft: 5,
    justifyContent: "center",
  },
  catSelector: {
    width:"85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: Constants.mediumbox,
    padding: 6,
    margin: 10,
  },
  selectedCategory: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
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
  },
});

export default FormThree;
