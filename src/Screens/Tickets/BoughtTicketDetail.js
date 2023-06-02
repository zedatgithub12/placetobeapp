//import liraries
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import SvgQRCode from "react-native-qrcode-svg";
import Constants from "../../constants/Constants";
import { Feather } from "react-native-vector-icons";
import Connection from "../../constants/connection";
// create a component
const BoughtDetail = ({ navigation, route }) => {
  const item = route.params;
  function Simple() {
    return <SvgQRCode value={Connection.url+item.id}/>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrcodecontainer}>
        <Simple
          style={styles.qrcode}
           
        />
      </View>

      <View style={styles.firstcontent}>
        <View>
          <Text style={styles.username} numberOfLines={1}>
            {item.username}
          </Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </View>

        <View style={styles.status}>
          <Text style={styles.statustxt}>Upcoming</Text>
        </View>
      </View>

      <Divider height="2" />

      <View style={styles.secondcontents}>
        <Text style={styles.leftside}>Ticket Name</Text>
        <Text style={styles.rightside}>{item.event_name}</Text>
      </View>
      <View style={styles.secondcontents}>
        <Text style={styles.leftside}>Type</Text>
        <Text style={styles.rightside}>{item.tickettype}</Text>
      </View>
      <View style={styles.secondcontents}>
        <Text style={styles.leftside}>Quantity</Text>
        <Text style={styles.rightside}>{item.quantity}</Text>
      </View>
      <View style={styles.secondcontents}>
        <Text style={styles.leftside}>Each Price</Text>
        <Text style={styles.rightside}>{item.price} Birr </Text>
      </View>
      <View style={styles.secondcontents}>
        <Text style={styles.leftside}>Bought by</Text>
        {item.p_gateway == 1 ? (
          <Text style={styles.rightside}>Telebirr</Text>
        ) : item.p_gateway == 2 ? (
          <Text style={styles.rightside}>Chapa</Text>
        ) : null}
      </View>
      <View style={styles.secondcontents}>
        <Text style={styles.leftside}>Date</Text>
        <Text style={styles.rightside}>{item.date}</Text>
      </View>

      <TouchableOpacity style={styles.viewEvent} activeOpacity={0.7} 
       onPress={() => navigation.navigate("EventDetail",   {id:item.event_id} )}>
        <Text style={styles.viewtxt}>View Event</Text>
        <Feather name="chevrons-right" size={22} color={Constants.primary} />
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Faded,
    paddingTop: 40,
  },
  qrcodecontainer: {
    margin: 20,
    alignSelf: "center",
    padding: 6,
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: Constants.Secondary,
  },
  firstcontent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    margin: 10,
  },
  username: {
    textTransform: "capitalize",
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    marginBottom: 8,
  },
  phone: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    marginBottom: 4,
  },
  status: {
    padding: 4,
  },
  statustxt: {
    backgroundColor: Constants.background,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 2,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
    color: Constants.green,
  },
  secondcontents: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    margin: 10,
  },
  leftside: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
  },
  rightside: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
  },
  viewEvent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 7,
    paddingHorizontal: 12,
    borderRadius: 3,
    marginRight: 18,
    alignItems: "center",
    marginTop: 20,
    textAlign: "right",
  },
  viewtxt: {
    color: Constants.Inverse,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
  },
});

//make this component available to the app
export default BoughtDetail;
