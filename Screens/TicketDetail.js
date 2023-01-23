//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Constants from "../constants/Constants";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Connection from "../constants/connection";
import { Badge } from "react-native-paper";

// create a component
const TicketDetail = ({ route, navigation }) => {
  const { item } = route.params;
  const [textc, setTextC] = useState(item.status);
  const [telebirr, setTelebirr] = useState(0);
  const [chapa, setChapa] = useState(0);
  // total sales
  const TotalSales = () => {
    var total;
    var soldItem = item.origionalamount - item.currentamount;
    total = soldItem * item.currentprice;
    return total;
  };
  //ticket sold

  const LeftTicket = () => {
    var Left = item.currentamount;
    return Left;
  };
  //ticket Left
  const SoldTicket = () => {
    var sold = item.origionalamount - item.currentamount;
    return sold;
  };

  // ticket status
  const Status = () => {
    var ticketStatus;

    switch (item.status) {
      case "0":
        ticketStatus = "Pending";
        break;

      case "1":
        ticketStatus = "In-Stock";
        break;

      case "2":
        ticketStatus = "Declined";
        break;

      case "3":
        ticketStatus = "Sold-out";
        break;

      default:
        ticketStatus = "Pending";
    }
    return ticketStatus;
  };

  //status text color
  const StatusText = () => {
    var StatusColor;

    switch (textc) {
      case "0":
        StatusColor = "#787878";
        break;

      case "1":
        StatusColor = "#0bb321";
        break;

      case "2":
        StatusColor = "#ff3d4d";
        break;

      case "3":
        StatusColor = "#787878";
        break;

      default:
        StatusColor = "#787878";
    }
    return StatusColor;
  };
  const [visible, setVisible] = React.useState(false);
  const toggleModal = () => {
    if (visible == false && Status() == "In-Stock") {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  //sold out ticket icon
  const [checkIcon, setCheckIcon] = useState(false);
  const [btn, setBtn] = useState(false);
  // update status of ticket
  const [TicketStatus, setTicketStatus] = React.useState(Status());
  const [indicator, setIndicator] = React.useState(false);

  const UpdateStatus = () => {

    const controller = new AbortController();
    const signal = controller.signal;

    setIndicator(true);
    var ApiUrl = Connection.url + Connection.Soldout;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      id: item.id,
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((response) => {
        var message = response[0].message;

        if (message === "succeed") {
          setTicketStatus("Sold-out");
          setTextC(3);
          setIndicator(false);
          setCheckIcon(true);
          setBtn(true);
        } else {
          setTicketStatus(Status());
          setIndicator(false);
        }
      })
      .catch((error) => {
        setTicketStatus(Status());
        setIndicator(false);
      });

      return () => {
        controller.abort();
    };
  };

  useEffect(() => {
    let isApiSubscribed = true;
   
       
    return () => {};
  }, [TicketStatus]);
  return (
    <ScrollView ContentContainerStyle={styles.container}>
      {/* section one */}

      <View style={styles.totalRevenue}>
        <Text style={styles.totaltext}>{TotalSales()}</Text>
        <Text style={styles.currency}>ETB</Text>
      </View>
      {/* section two */}
      <View style={styles.secondContainer}>
        <View style={styles.itemProgress}>
          <Text style={styles.itemCount}>{SoldTicket()}</Text>
          <Text style={styles.itemNaming}>Ticket Sold</Text>
        </View>

        <View style={styles.itemProgress}>
          <Text style={styles.leftCount}>{LeftTicket()}</Text>
          <Text style={styles.itemNaming}>Ticket Left</Text>
        </View>
      </View>
      {/* section three */}
      <View style={styles.sectionThree}>
        <View style={styles.threeOne}>
          <View>
            <Text style={styles.Label} numberOfLines={2}>
              {item.event_name}
            </Text>
            <Text style={styles.threeText}>{item.tickettype}</Text>
          </View>

          <View style={styles.statusBTN}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={visible}
              style={styles.modal}
              onRequestClose={() => setVisible(false)}
            >
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                  <View style={styles.closebtn}>
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={Constants.Inverse}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  disabled={btn}
                  onPress={() => UpdateStatus()}
                >
                  {indicator ? (
                    <ActivityIndicator size="small" color={Constants.primary} />
                  ) : (
                    <View style={styles.modalCont}>
                      <Text style={styles.modalDesc}>
                        To make it unavailable, press the button!
                      </Text>
                      <View style={[styles.itemStatus]}>
                        <Text style={styles.statusTexts}>Sold Out</Text>
                        {checkIcon ? (
                          <Ionicons
                            name="ios-checkmark-circle-sharp"
                            size={20}
                            color={Constants.green}
                          />
                        ) : null}
                      </View>
                    </View>
                  )}
                </TouchableWithoutFeedback>
              </View>
            </Modal>
            <TouchableWithoutFeedback onPress={() => toggleModal()}>
              <Text style={[styles.statusContainer, { color: StatusText() }]}>
                {Status() == "Sold-out" ? (
                  <Ionicons
                    name="ios-checkmark-circle-outline"
                    size={14}
                    color={StatusText()}
                  />
                ) : null}

                {TicketStatus}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.threeTwo}>
          <Text style={styles.Label}>Ticket Price</Text>
          <Text style={styles.threeText}>{item.currentprice}</Text>
        </View>
      </View>

      {/* section four */}
      <View>
        <View style={styles.PGContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.gatewayContainer}>
              <Image
                source={require("../assets/telebirr.png")}
                resizeMode="contain"
                style={styles.pgateway}
              />
              <Badge size={24} style={styles.countBadge}>
                {telebirr}
              </Badge>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback>
            <View style={styles.gatewayContainer}>
              <Image
                source={require("../assets/chapa.png")}
                resizeMode="contain"
                style={styles.pgateway}
              />
              <Badge size={24} style={styles.countBadge}>
                {chapa}
              </Badge>
            </View>
          </TouchableWithoutFeedback>
        </View>

      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
  },
  totalRevenue: {
    flexDirection: "row",
    width: "100%",
    height: 160,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.primary,
  },
  totaltext: {
    fontWeight: Constants.Boldtwo,
    fontSize: 32,
    color: Constants.background,
  },
  currency: {
    color: Constants.Inverse,
    fontWeight: Constants.Bold,
    marginLeft: 6,
  },
  secondContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: -58,
  },
  itemProgress: {
    backgroundColor: Constants.background,
    padding: 24,
    alignItems: "center",
    borderRadius: Constants.medium,
    elevation: 3,
    shadowColor: Constants.icon,
  },
  itemCount: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.green,
  },
  leftCount: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.Inverse,
  },
  itemNaming: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    //fontFamily:Constants.fontFam,
    color: Constants.Secondary,
    marginTop: 4,
  },
  sectionThree: {
    width: "86%",
    alignSelf: "center",
  },
  threeOne: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 3,
    padding: 6,
  },
  threeTwo: {
    margin: 3,
    padding: 6,
  },
  Label: {
    marginRight: 10,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
  },
  threeText: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
    color: Constants.Secondary,
  },
  statusContainer: {
    borderRadius: Constants.tinybox,
    padding: 4,
    paddingHorizontal: 16,
    fontStyle: "italic",
    fontWeight: Constants.Bold,
  },
  modal: {
    //backgroundColor:Constants.icon
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Constants.background,
    width: "98%",
    height: 220,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 4,
    borderTopEndRadius: Constants.borderRad,
    borderTopLeftRadius: Constants.borderRad,
  },
  modalCont: {
    width: "90%",
    alignItems: "center",
  },
  modalDesc: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.green,
    marginBottom: 20,
  },
  itemStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 20,
    width: "80%",
    padding: 10,
    backgroundColor: Constants.Faded,
    margin: 6,
    borderRadius: 50,
    alignItems: "center",
  },
  statusTexts: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
  },
  instockTexts: {
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Faded,
  },
  touchable: {
    borderRadius: 50,
  },
  closebtn: {
    position: "absolute",
    right: 15,
    top: -15,
    backgroundColor: Constants.background,
    padding: 6,
    borderRadius: 50,
    elevation: 2,
  },
  PGContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pgateway: {
    height: 80,
    width: 80,
    backgroundColor: Constants.background,
    borderRadius: Constants.medium,
    margin: 26,
    padding: 26,
  },
  countBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    //backgroundColor: Constants.red,
    color: Constants.background,
  },

});

//make this component available to the app
export default TicketDetail;
