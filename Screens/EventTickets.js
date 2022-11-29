import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import {
  addTicket,
  decrease,
  getTicketTotal,
  increase,
  newItem,
} from "../Reducer/Ticket";
import {
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome5,
} from "react-native-vector-icons";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";

const EventTickets = ({ navigation, route }) => {
  const { item } = route.params;

  
  var featuredImageUri = Connection.url + Connection.assets;

  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.ticket);

 // const { totalCount, totalAmount } = useSelector((state) => state.ticket);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState();
  const [total, setTotal] = useState();
  const [ticket, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState();
 
  //const [visible, setVisible] = useState(true);
  const [active, setActiveIndex] = useState();
  const [disable, setDisable] = useState(false);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const handlechange = (index) => {
    const newItem = tickets[index];
    const newUpdate = { ...newItem, open: false };
    console.log(newUpdate);
    dispatch(addTicket(newUpdate));
  };

  const TicketName = (iconname) => {
    var name;
    switch (iconname) {
      case "Early Bird":
        name = "bird";
        break;

      case "Regular":
        name = "ticket";
        break;

      case "VIP":
        name = "star-outline";
        break;

      case "VVIP":
        name = "star-shooting-outline";
        break;

      case "Student":
        name = "book-education-outline";
        break;

      case "Kids":
        name = "baby-face-outline";
        break;

      case "Adult":
        name = "face-man";
        break;

      case "Member":
        name = "account-group-outline";
        break;

      default:
        name = "ticket";
    }
    return name;
  };

  //ticket icon color
  const TicketColor = (iconname) => {
    var Color;

    switch (iconname) {
      case "Early Bird":
        Color = "#ff24da";
        break;

      case "Regular":
        Color = "#00a2ff";

        break;

      case "VIP":
        Color = "#ffc800";

        break;

      case "VVIP":
        Color = "#ffb300";

        break;

      case "Student":
        Color = "#00c4de";

        break;

      case "Kids":
        Color = "#ff3686";

        break;

      case "Adult":
        Color = "#ff551c";

        break;

      case "Member":
        Color = "#5fcc41";

        break;

      default:
        Color = "#ffbb00";
    }
    return Color;
  };
  const DateFun = (startingTime) => {
    var date = new Date(startingTime);
    let day = date.getDay();
    let month = date.getMonth();
    let happeningDay = date.getDate();

    // return weekname
    var weekday = new Array(7);
    weekday[1] = "Mon, ";
    weekday[2] = "Tue, ";
    weekday[3] = "Wed, ";
    weekday[4] = "Thu, ";
    weekday[5] = "Fri, ";
    weekday[6] = "Sat, ";
    weekday[0] = "Sun, ";

    //an array of month name
    var monthName = new Array(12);
    monthName[1] = "Jan";
    monthName[2] = "Feb";
    monthName[3] = "Mar";
    monthName[4] = "Apr";
    monthName[5] = "May";
    monthName[6] = "Jun";
    monthName[7] = "Jul";
    monthName[8] = "Aug";
    monthName[9] = "Sep";
    monthName[10] = "Oct";
    monthName[11] = "Nov";
    monthName[12] = "Dec";

    return weekday[day] + monthName[month + 1] + " " + happeningDay;
  };

  /****************************************************** */
  //featch Tickets
  /***************************************************** */
  const FetchTicket = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var ApiUrl = Connection.url + Connection.eventTicket;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };
    var Data = {
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
        var eventTickets = response[0].tickets;
        if (message === "succeed") {
          setTickets(eventTickets);
          // setExist(true);
        } else {
          setTickets();
          // setExist(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      controller.Abort();
    };
  };

  //increase count of an item
  const IncreaseCount = (identity) => {
     ticket.map((item) => {
      if (item.id === identity) {
        setAmount(amount + 1);
        setPrice(item.currentprice);
        setSelectedTicket(item);
      }

      return item;
    });
  
    
  };

  //Decrease count of an item
  const DecreaseCount = (identity) => {
    var decresed = ticket.map((item) => {
      if (item.id === identity && amount > 0) {
        setAmount(amount - 1);
        setPrice(item.currentprice);
      }
      return item;
    });
  
  };

  //on continue button get pressed 
  const PaymentGateway =()=>{
   //selectedTicket.quantity = amount;
   const pass = {...selectedTicket, amount};
    console.log(pass);
    navigation.navigate("Checkout Screen",{pass});
  }



  useEffect(() => {
    var isSubcribed = true;
    if (isSubcribed) {
      FetchTicket();
      // dispatch(getTicketTotal());
      dispatch(addTicket(ticket));
    }
    return () => {
      isSubcribed = false;
    };
  }, [ticket]);

  return (
    <SafeAreaView style={styles.Main}>
      <View>
        <View
          style={[
            styles.ticketsdescription,
            { height: height / 4, width: width },
          ]}
        >
          <View style={[styles.imageContainer]}>
            <Image
              style={styles.image}
              source={{
                uri: featuredImageUri + item.event_image,
              }}
            />
          </View>

          <View style={[styles.DiscriptionText]}>
            <View>
              <Text style={[styles.H1Text]}>{item.event_name}</Text>
            </View>

            <View style={[styles.Date]}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={16}
                color={Constants.green}
              />
              <Text style={[styles.H4Text]}>{DateFun(item.start_date)}</Text>
            </View>

            <View style={[styles.Date]}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={16}
                color={Constants.green}
              />
              <Text style={[styles.H4Text]}>{item.event_address}</Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.H1Text, { margin: 10, marginLeft: 22, marginTop: 16 }]}
        >
          Avaliable Tickets
        </Text>

        {ticket.map((tik, index) => (
          <View
            key={tik.id}
            style={[
              styles.TicketView,
              active === index
                ? { borderLeftWidth: 3, borderLeftColor: Constants.primary }
                : null,
            ]}
          >
            <View style={styles.LeftTicket}>
              <View style={styles.IconWrapper}>
                <MaterialCommunityIcons
                  name={TicketName(tik.tickettype)}
                  size={22}
                  color={TicketColor(tik.tickettype)}
                />
              </View>

              <View>
                <Text style={styles.productTitle}>{tik.tickettype}</Text>
                {amount !== 0 ? (
                  <View>
                    <Text
                      style={[
                        styles.price,
                        amount !== 0 ? { color: "black" } : { color: "black" },
                      ]}
                    >
                      {tik.currentprice} Birr
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.price}>{tik.currentprice} Birr</Text>
                )}
              </View>
            </View>

            <View style={styles.productRightView}>
              {active == index ? (
                <View style={styles.productItemCounterView}>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        if (amount < 2) {
                          setActiveIndex(null);
                          setDisable(false);
                        }
                        // amount > 0 && dispatch(decrease(tik.id));
                        DecreaseCount(tik.id);
                      }}
                      style={styles.counterButton}
                    >
                      <MaterialCommunityIcons
                        name="minus-thick"
                        size={16}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.amountcounterButton}>
                    <Text style={[styles.counterValue]}>{amount}</Text>
                  </View>

                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setDisable(true);
                        IncreaseCount(tik.id);
                       // dispatch(increase(tik.id));
                      }}
                      style={styles.counterButton}
                    >
                      <MaterialCommunityIcons
                        name="plus-thick"
                        size={16}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setActiveIndex(index);
                  //  dispatch(newItem(tik.id));
                    handlechange(index);
                  }}
                  disabled={disable}
                >
                  <View
                    style={[
                      styles.buyBtn,
                      {
                        backgroundColor: disable
                          ? Constants.Secondary
                          : Constants.primary,
                          color: disable
                          ? Constants.background
                          : Constants.Inverse,
                      },
                    ]}
                  >
                    <Text style={styles.buyTxt}>Buy</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          // <AvaliableTickets key={tik.id} ticket={tik} />
        ))}
      </View>

      {disable && (
        <View style={[styles.bottomNavigationView]}>
          <View></View>
          <View style={[{ flexDirection: "row" }, { alignItems: "center" }]}>
            <Text style={styles.BStext}>Total</Text>
          </View>

          <View style={styles.LeftbottomNavigationView}>
            <Text style={styles.BSTicketcount}>{price * amount} Birr</Text>
          </View>
          <TouchableOpacity
            onPress={() => PaymentGateway()}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Countinue</Text>
            <MaterialCommunityIcons name="arrow-right" size={14} color={Constants.background} style={{marginLeft:4,}}/>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Main: {
    flex: 1,
    alignItems: "center",
  },
  ticketsdescription: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  imageContainer: {
    paddingLeft: 10,
    height: "100%",
    width: "50%",
  },
  image: {
    borderRadius: Constants.medium,
    height: "100%",
    resizeMode: "contain",
    width: "100%",
    backgroundColor: Constants.background,
    marginLeft: 8,
    marginRight: 8,
  },
  DiscriptionText: {
    marginLeft: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    // justifyContent: 'space-around',
    spacing: 2,
    height: "100%",
    width: "50%",
  },
  H1Text: {
    fontSize: Constants.headingone,
    fontWeight: "bold",
    color: Constants.Inverse,
  },
  H4Text: {
    fontSize: 15,
    color: "grey",
    paddingLeft: 10,
  },
  Date: {
    marginTop: 14,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  bottomsheet: {
    position: "absolute",
    bottom: 0,
    height: 10,
    right: 0,
    width: "100%",
    backgroundColor: "#900",
  },
  counterButton: {
    backgroundColor: "#ffbb00",
    borderRadius: 5,
    padding: 6,
  },
  amountcounterButton: {
    padding: 8,
  },
  LeftTicket: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartTitleView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  IconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 40,
    width: 40,
    backgroundColor: Constants.background,
    borderRadius: 50,
    padding: 7,
  },
  cartTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 10,
  },
  TicketView: {
    flexDirection: "row",
    backgroundColor: Constants.transparentPrimary,
    paddingVertical: 10,
    paddingHorizontal: 12,

    justifyContent: "space-between",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    borderRadius: 5,
    marginTop: 5,
    marginHorizontal: 20,
  },
  TicketImage: {
    width: 40,
    height: 60,
    alignSelf: "center",
  },
  productMiddleView: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  price: {
    color: Constants.Success,
  },
  productTitle: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
  },
  productCompanyTitle: {
    fontSize: 16,
    fontWeight: "300",
  },
  productRightView: {
    alignItems: "center",
    justifyContent: "center",
  },
  productItemCounterView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 4,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: "500",
  },
  productPriceText: {
    alignSelf: "flex-end",
    paddingRight: 10,
    fontSize: 20,
    fontWeight: "700",
  },
  toggleCounterButton: {
    paddingHorizontal: 10,
  },
  buyBtn: {
    padding: 5,
    borderRadius: Constants.tiny,
    paddingHorizontal: 16,
  },
  buyTxt: {
    fontSize: Constants.headingthree,
    color: Constants.Inverse,
    fontWeight: Constants.Boldtwo,
  },
  ///

  BSTicketTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffbb00",
    marginRight: 5,
  },
  BSTicketcount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffbb00",
    marginRight: 5,
    marginLeft: 5,
  },

  BStext: {
    fontSize: Constants.headingone,
    fontWeight: "bold",
    color: "white",
    marginRight: 5,
  },
  LeftbottomNavigationView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavigationView: {
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: Constants.Inverse,
    width: "100%",
    height: 100,
    position: "absolute",
    bottom: 0,
    margin: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appButtonContainer: {
    flexDirection:"row",
    alignItems:"center",
    elevation: 8,
    backgroundColor: Constants.Inverse,
    borderRadius: Constants.tiny,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor:Constants.background,
    marginRight:6,
  //  backgroundColor:Constants.transparentPrimary
  },
  
  appButtonText: {
    fontSize: Constants.headingtwo,
    color: Constants.background,
    fontWeight: Constants.Boldtwo,
    alignSelf: "center",
   
  },
});

export default EventTickets;
