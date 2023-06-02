import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Constants from "../../constants/Constants";
import { MaterialIcons } from "react-native-vector-icons";
import { Divider } from "react-native-paper";

const DropDown = () => {
  const Menus = [
    {
      id: "01",
      title: "All",
    },

    {
      id: "02",
      title: "Hotel",
    },
    {
      id: "03",
      title: "Parks",
    },
    {
      id: "04",
      title: "Lakes",
    },
    {
      id: "05",
      title: "Falls",
    },
    {
      id: "06",
      title: "Bars",
    },
    {
      id: "07",
      title: "Hills",
    },
  ];
  // visiblity state for dropdown menu
  const [visible, setVisible] = React.useState(false);
  //when dropdown button clicked the following method is called
  const openMenu = () =>{
    setVisible(!visible);
  } 
  // when Item selected the closemnu function is called to close the droped menu
  const closeMenu = () => setVisible(false);
  // menu item component for Menu item Flatlist
  const MenuItem = ({ title }) => (
    <TouchableOpacity
      style={styles.itemStyle}
      onPress={() => MenuPressed(title)}
    >
      <Text style={styles.title}>{title}</Text>
      <Divider />
    </TouchableOpacity>
  );
  // The following constant render the component made for dropdown menu
  const renderItem = ({ item }) => <MenuItem title={item.title} />;
  // Menu options selection
  const [choice, setChoice] = useState("All");
  //MenuPressed() method is called user click the item in the drop down menu
  const MenuPressed = (title) => {
    setChoice(title);
    setVisible(false);
  };

  return (
    <View style={{ height: 50 }}>
      <View
        style={styles.dropdownContainer}
        //container of dropdown Button
      >
        <TouchableOpacity
          // A button to be pressed inorder to show droped down menu
          style={styles.DropDownBtn}
          onPress={()=>openMenu()}
        >
          <Text style={styles.dropDownText}>{choice}</Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={20}
            style={styles.downIcons}
          
          />
        </TouchableOpacity>
      </View>
      {visible ? 
        <View
          // a container of dropDown menu item
          style={styles.menuOption}
        >
          <FlatList
            data={Menus}
            renderItem={renderItem}
            keyExtractor={(MenuItem) => MenuItem.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
       : null}
    </View>
  );
};
const styles = StyleSheet.create({
  dropdownContainer: {
    position: "relative",
    alignSelf: "flex-end",
    margin: 10,
    marginRight: 20,
    backgroundColor: Constants.background,
    borderRadius: Constants.tiny,
    padding: 5,
    elevation: 2,
    zIndex: 1,
  },
  DropDownBtn: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  dropDownText: {
    fontSize: Constants.thirty,
    fontWeight: Constants.Boldtwo,
  },
  menuOption: {
    backgroundColor: Constants.background,
    position: "relative",
    alignSelf: "flex-end",
    zIndex: 2,
    padding: 10,
    elevation: 2,
    marginHorizontal: 16,
    height: 250,
    width: "50%",
    borderRadius: Constants.tinybox,
  },
  itemStyle: {
    padding: 8,
    width: "100%",
  },
  title: {
    fontSize: Constants.headingthree,
    color: Constants.Inverse,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Boldtwo,
  },
});
export default DropDown;
