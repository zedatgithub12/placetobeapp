//import liraries
import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  Modal,
  ActivityIndicator,
} from "react-native";
import Constants from "../constants/Constants";
import { Feather, MaterialCommunityIcons } from "react-native-vector-icons";
import Connection from "../constants/connection";
// create a component
const TicketDetail = ({ route, navigation }) => {
  const { item } = route.params;

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

    switch (item.status) {
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
    if (visible == true) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  // update status of ticket
  const [TicketStatus, setTicketStatus] = React.useState(Status());
  const [indicator, setIndicator] = React.useState(false);

  const UpdateStatus = () => {
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
          setIndicator(false);
    
       
        } else {
          setTicketStatus(Status());
          setIndicator(false);
    
         
        }
      })
      .catch((error) => {
        setTicketStatus(Status());
        setIndicator(false);
  
  
      });
  };

  useEffect(() => {
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
              onPress={() => setVisible(false)}
            >
              <View style={styles.modalContainer}>

                  <TouchableNativeFeedback
                onPress={()=>setVisible(false)}
                  >
                      <View style={styles.closebtn}>
                      <MaterialCommunityIcons
                        name="close"
                        size={20}
                        color={Constants.red}
                      />
                      </View>
                  
                  </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => UpdateStatus()}>
                  {indicator ? (
                    <ActivityIndicator size="small" color={Constants.primary} />
                  ) : (
                    <View style={[styles.itemStatus]}>
                      <Text style={styles.statusTexts}>Sold Out</Text>
                      <Feather
                        name="check-circle"
                        size={20}
                        color={Constants.green}
                      />
                    </View>
                  )}
                </TouchableNativeFeedback>
              </View>
            </Modal>
            <TouchableNativeFeedback onPress={() => toggleModal()}>
              <Text
                style={[
                  styles.statusContainer,
                  { backgroundColor: StatusText() },
                ]}
              >
                {TicketStatus}
              </Text>
            </TouchableNativeFeedback>
          </View>
        </View>

        <View style={styles.threeTwo}>
          <Text style={styles.Label}>Ticket Price</Text>
          <Text style={styles.threeText}>{item.currentprice}</Text>
        </View>
      </View>

      {/* section four */}
      <View>
        <View></View>

        <View></View>
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
    backgroundColor: Constants.Secondary,
  },
  totaltext: {
    fontWeight: Constants.Bold,
    fontSize: 32,
    color: Constants.background,
  },
  currency: {
    color: Constants.primary,
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
    backgroundColor: Constants.Faded,
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
    color: Constants.Secondary,
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
    color: Constants.background,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Constants.background,
    width: "98%",
    height: 130,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 2,
    borderTopEndRadius: Constants.borderRad,
    borderTopLeftRadius: Constants.borderRad,
  },

  instockStatus: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",

    padding: 10,
    paddingHorizontal: 20,

    margin: 6,
    borderRadius: 50,
    alignItems: "center",
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
  closebtn:{
     position: "absolute",
     right: 15,
     top:-15,
     backgroundColor: Constants.Faded,
     padding:6,
     borderRadius:50,
     elevation:2,
  }
});

//make this component available to the app
export default TicketDetail;
