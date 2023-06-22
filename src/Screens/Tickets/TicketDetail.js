//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import Constants from "../../constants/Constants";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Connection from "../../constants/connection";
import { Badge, Caption } from "react-native-paper";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
// Organizer Ticket Detail
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
    var ApiUrl = Connection.url + Connection.Soldout + item.id;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "PUT",
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
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
      .catch(() => {
        setTicketStatus(Status());
        setIndicator(false);
      });

    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    return () => {};
  }, [TicketStatus]);
  return (
    <ScrollView ContentContainerStyle={styles.container}>
      <View style={styles.sectionOne}>
        <View style={styles.OneView}>
          <View>
            <Text style={styles.Label} numberOfLines={2}>
              {item.event_name}
            </Text>
            <Text style={styles.ticketType}>{item.tickettype}</Text>
          </View>

          <View style={styles.statusBTN}>
            <Modal
              animationType="fade"
              transparent={true}
              isVisible={visible}
              style={styles.modal}
              onRequestClose={() => setVisible(false)}
              onBackdropPress={() => setVisible(false)}
            >
              <Animatable.View
                animation="slideInUp"
                style={styles.modalContainer}
              >
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                  <View style={styles.closebtn}>
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={Constants.Secondary}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <View>
                  <View style={styles.modalCont}>
                    <Text style={styles.modalDesc}>Change Ticket Status</Text>
                    <Caption style={{ marginBottom: 20 }}>
                      Once you changed the status to sold out, you can't revert
                      the change from your side
                    </Caption>
                    <TouchableWithoutFeedback
                      disabled={btn}
                      onPress={() => UpdateStatus()}
                    >
                      <View
                        style={[
                          styles.itemStatus,
                          {
                            justifyContent: checkIcon
                              ? "space-between"
                              : "center",
                            marginBottom: 20,
                          },
                        ]}
                      >
                        {indicator ? (
                          <ActivityIndicator
                            size="small"
                            color={Constants.primary}
                          />
                        ) : (
                          <>
                            <Text style={styles.statusTexts}>Sold Out</Text>

                            {checkIcon ? (
                              <Ionicons
                                name="ios-checkmark-circle-sharp"
                                size={20}
                                color={Constants.background}
                                style={{ marginLeft: 10 }}
                              />
                            ) : null}
                          </>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </Animatable.View>
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

        <View style={styles.ticketPrice}>
          <Text style={styles.Label}>Ticket Price</Text>
          <Text style={styles.threeText}>{item.currentprice} ETB</Text>
        </View>
      </View>

      <View style={styles.secondContainer}>
        <View style={styles.sold}>
          <View>
            <Text style={styles.itemCount}>{SoldTicket()}</Text>
            <Text style={styles.itemNaming}>Ticket Sold</Text>
          </View>
          <MaterialCommunityIcons
            name="progress-check"
            size={28}
            color={Constants.Success}
            style={{ marginRight: 4 }}
          />
        </View>

        <View style={styles.left}>
          <View>
            <Text style={styles.leftCount}>{LeftTicket()}</Text>
            <Text style={styles.itemNaming}>Ticket Left</Text>
          </View>

          <MaterialCommunityIcons
            name="progress-clock"
            size={28}
            color={Constants.primary}
            style={{ marginRight: 4 }}
          />
        </View>
      </View>
      <View style={styles.totalRevenue}>
        <View
          style={{
            position: "absolute",
            top: 0,
            flexDirection: "row",
            padding: 12,
            alignItems: "center",
          }}
        >
          <Ionicons
            name="ios-stats-chart"
            size={19}
            color={Constants.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.itemNaming}>Total Revenue</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <Text style={styles.totaltext}>{TotalSales()}</Text>
          <Text style={styles.currency}>ETB</Text>
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
  sectionOne: {
    backgroundColor: Constants.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  OneView: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 3,
    padding: 6,
  },
  ticketPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 3,
    padding: 6,
  },
  Label: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
  },
  statusContainer: {
    minWidth: 100,
    backgroundColor: Constants.background,
    borderRadius: 50,
    padding: 6,
    paddingHorizontal: 16,
    fontWeight: Constants.Boldtwo,
  },
  ticketType: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
    color: Constants.Inverse,
  },
  threeText: {
    minWidth: 100,
    borderRadius: 50,
    padding: 6,
    paddingHorizontal: 16,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
  // an style for a
  secondContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 14,
    marginHorizontal: 8,
  },
  left: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Constants.background,
    padding: 18,
    borderRadius: Constants.medium,
    borderColor: Constants.background,
    borderWidth: 1,
  },
  sold: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Constants.background,
    padding: 18,
    borderRadius: Constants.medium,
    borderColor: Constants.background,
    borderWidth: 1,
  },

  itemCount: {
    width: Dimensions.get("screen").width / 3.9,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.Inverse,
  },
  leftCount: {
    width: Dimensions.get("screen").width / 3.9,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.Inverse,
  },
  itemNaming: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
    color: Constants.Inverse,
  },
  totalRevenue: {
    position: "relative",
    flexDirection: "column",
    width: "93%",
    padding: 20,
    paddingTop: 35,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: Constants.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Constants.transparentPrimary,
  },
  totaltext: {
    fontWeight: Constants.Bold,
    fontFamily: Constants.fontFam,
    fontSize: 32,
    color: Constants.Secondary,
  },
  currency: {
    color: Constants.Secondary,
    fontWeight: Constants.Boldtwo,
    marginLeft: 6,
    marginBottom: 10,
  },
  modal: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 50,
  },
  modalContainer: {
    backgroundColor: Constants.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 160,
    maxHeight: Dimensions.get("screen").height / 1.5,
    width: Dimensions.get("screen").width / 1.2,
    alignItems: "center",
  },

  modalDesc: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
    marginBottom: 10,
  },
  itemStatus: {
    flexDirection: "row",
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: Constants.primary,
    margin: 6,
    marginTop: 19,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
  },
  statusTexts: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingthree,
    color: Constants.Inverse,
    marginRight: 6,
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
    right: 0,
    top: 0,
    padding: 10,
    borderTopRightRadius: 10,
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
