//import liraries
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Divider } from "react-native-paper";
import SvgQRCode from "react-native-qrcode-svg";
import Constants from "../../constants/Constants";
import Connection from "../../constants/connection";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../themes/typography";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { DateFormater, Status, StatusText } from "../../Utils/functions";

// create a component
const BoughtDetail = ({ navigation, route }) => {
  const item = route.params;
  function Simple() {
    return (
      <SvgQRCode
        value={Connection.url + item.id}
        size={180}
        enableLinearGradient={true}
        linearGradient={[theme.primary[700], theme.dark.main]}
      />
    );
  }
  const { theme } = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.background.darker }}>
      <View style={styles.qrcodecontainer}>
        <Simple />
      </View>

      <View
        style={[
          styles.firstcontent,
          {
            backgroundColor: theme.background.main,
            borderWidth: 0.2,
            borderColor: theme.dark[200],
            borderRadius: 2,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              textTransform: "capitalize",
              fontFamily: Typography.family,
              fontSize: Typography.size.headingtwo,
              fontWeight: Typography.weight.bold,
              marginBottom: 8,
            }}
          >
            Buyer Info
          </Text>
        </View>
        <Divider height="2" />
        <View style={{ paddingHorizontal: 20, paddingVertical: 6 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.leftside}>Full name</Text>
            <Text style={styles.username} numberOfLines={1}>
              {item.username}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.leftside}>Phone</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.firstcontent,
          {
            backgroundColor: theme.background.main,
            borderWidth: 0.2,
            borderColor: theme.dark[200],
            borderRadius: 2,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              textTransform: "capitalize",
              fontFamily: Typography.family,
              fontSize: Typography.size.headingtwo,
              fontWeight: Typography.weight.bold,
              marginBottom: 8,
            }}
          >
            Ticket Info
          </Text>
          <View style={styles.status}>
            <Text
              style={[styles.statustxt, { color: StatusText(item.status) }]}
            >
              {item.status == 2 && (
                <MaterialCommunityIcons name="check-circle" size={13} />
              )}
              {Status(item.status)}
            </Text>
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
          <Text style={styles.rightside}>{DateFormater(item.date)}</Text>
        </View>

        <TouchableOpacity
          style={styles.viewEvent}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("EventDetail", { id: item.event_id })
          }
        >
          <Text style={styles.viewtxt}>View Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  qrcodecontainer: {
    width: Dimensions.get("screen").width / 1.8,
    height: Dimensions.get("screen").height / 3.8,
    margin: 30,
    alignSelf: "center",
    justifyContent: "center",
    padding: 6,
  },
  qrcode: {
    width: "100%",
    height: "100%",
  },
  firstcontent: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  username: {
    textTransform: "capitalize",
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
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
    paddingVertical: 4,
  },
  statustxt: {
    padding: 4,
    paddingHorizontal: 4,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingthree,
  },
  secondcontents: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    margin: 10,
  },
  leftside: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    color: Constants.Inverse,
  },
  rightside: {
    textTransform: "capitalize",
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
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
