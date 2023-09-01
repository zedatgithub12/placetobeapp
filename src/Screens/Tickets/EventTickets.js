import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import {
  addTicket,
  decrease,
  getTicketTotal,
  increase,
  newItem,
} from "../../Reducer/Ticket";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Constants from "../../constants/Constants";
import Connection from "../../api";
import { DateFormater, TicketColor, TicketName } from "../../Utils/functions";
import Loader from "../../ui-components/ActivityIndicator";
import { useTheme } from "@react-navigation/native";

const EventTickets = ({ navigation, route }) => {
  const { item } = route.params;

  const { theme } = useTheme();

  var featuredImageUri = Connection.url + Connection.assets;

  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.ticket);

  // const { totalCount, totalAmount } = useSelector((state) => state.ticket);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState();
  const [ticket, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState();
  const [active, setActiveIndex] = useState();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlechange = (index) => {
    const newItem = tickets[index];
    const newUpdate = { ...newItem, open: false };
    // console.log(newUpdate);
    dispatch(addTicket(newUpdate));
  };

  /****************************************************** */
  //featch Tickets
  /***************************************************** */
  const FetchTicket = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    var ApiUrl = Connection.url + Connection.eventTicket + item.id;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setTickets(response.data);
          setLoading(false);
        } else {
          setLoading(false);
          setTickets(response.data);
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
  const PaymentGateway = () => {
    //selectedTicket.quantity = amount;
    const pass = { ...selectedTicket, amount };

    navigation.navigate("Checkout Screen", { pass });
  };

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
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.Main,
        { backgroundColor: theme.background.darker },
      ]}
    >
      {loading ? (
        <View>
          <Loader size="small" color={theme.primary.main} />
        </View>
      ) : (
        <View>
          {item && (
            <View style={[styles.ticketsdescription]}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{
                    uri: featuredImageUri + item.event_image,
                  }}
                />
              </View>

              <View style={styles.DiscriptionText}>
                <Text style={styles.H1Text}>{item.event_name}</Text>

                <View style={styles.Date}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={16}
                    color={Constants.primary}
                  />
                  <Text style={styles.H4Text} numberOfLines={1}>
                    {DateFormater(item.start_date)}
                  </Text>
                </View>

                <View style={[styles.Date]}>
                  <MaterialCommunityIcons
                    name="map-marker-radius"
                    size={16}
                    color={theme.primary.main}
                  />
                  <Text style={styles.H4Text} numberOfLines={2}>
                    {item.event_address}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Text
            style={[
              styles.H1Text,
              { margin: 10, marginLeft: 22, marginTop: 16 },
            ]}
          >
            Avaliable Tickets
          </Text>

          {ticket.length > 0 ? (
            ticket.map((ticket, index) => (
              <View
                key={index}
                style={[
                  styles.TicketView,
                  active === index && {
                    borderLeftWidth: 3,
                    borderLeftColor: Constants.primary,
                  },
                ]}
              >
                <View style={styles.LeftTicket}>
                  <View style={styles.IconWrapper}>
                    <MaterialCommunityIcons
                      name={TicketName(ticket.tickettype)}
                      size={24}
                      color={TicketColor(ticket.tickettype)}
                    />
                  </View>

                  <View>
                    <Text style={styles.productTitle}>{ticket.tickettype}</Text>
                    {amount !== 0 ? (
                      <View>
                        <Text
                          style={[
                            styles.price,
                            amount !== 0
                              ? { color: "black" }
                              : { color: "black" },
                          ]}
                        >
                          {ticket.currentprice} Birr
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.price}>
                        {ticket.currentprice} Birr
                      </Text>
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

                            DecreaseCount(ticket.id);
                          }}
                          style={styles.counterButton}
                        >
                          <MaterialCommunityIcons
                            name="minus-thick"
                            size={16}
                            color={theme.dark[400]}
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
                            IncreaseCount(ticket.id);
                          }}
                          style={styles.counterButton}
                        >
                          <MaterialCommunityIcons
                            name="plus-thick"
                            size={16}
                            color={theme.dark[400]}
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
            ))
          ) : (
            <View style={styles.noTicketView}>
              <MaterialCommunityIcons
                name="ticket"
                size={46}
                color={Constants.Secondary}
              />
              <Text style={styles.NoText}>No Ticket Available </Text>
            </View>
          )}
        </View>
      )}
      {disable && (
        <View style={styles.bottomNavigationView}>
          <View
            style={[
              {
                marginTop: 16,
                marginLeft: 8,
                width: "94%",
              },
            ]}
          >
            <Text style={styles.BSTicketTotal}>
              {parseFloat(price * amount).toFixed(2)} ETB
            </Text>
            <Text style={[styles.BStext, { color: theme.dark.main }]}>
              Total price
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => PaymentGateway()}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  Main: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  ticketsdescription: {
    width: Dimensions.get("screen").width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    paddingLeft: 4,
    height: 180,
    width: 180,
  },
  image: {
    backgroundColor: Constants.background,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginHorizontal: 8,
    padding: 4,
    borderRadius: Constants.medium,
    borderWidth: 2,
    borderColor: Constants.background,
  },
  DiscriptionText: {
    flexDirection: "column",
    spacing: 6,
    height: "100%",
    width: "50%",
  },
  H1Text: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  H4Text: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Boldtwo,
    color: Constants.Inverse,
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
    backgroundColor: Constants.background,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
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
    color: Constants.Inverse,
  },
  productTitle: {
    fontSize: Constants.headingthree,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
    textTransform: "capitalize",
  },
  productCompanyTitle: {
    // fontSize: 16,
    // fontWeight: "300",
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
  bottomNavigationView: {
    paddingHorizontal: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Constants.background,
    width: "100%",
    height: 140,
    position: "absolute",
    bottom: 0,
    margin: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },

  BSTicketTotal: {
    fontSize: Constants.primaryHeading,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
  },

  BStext: {
    fontSize: Constants.headingthree,
    marginRight: 5,
  },

  appButtonContainer: {
    width: "96%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 8,
  },

  appButtonText: {
    fontSize: Constants.headingone,
    color: Constants.Inverse,
    fontWeight: Constants.Boldtwo,
    alignSelf: "center",
  },
  noTicketView: {
    margin: 20,
    marginTop: 60,
    alignSelf: "center",
    alignItems: "center",
    padding: 20,
  },
  NoText: {
    fontWeight: Constants.Boldtwo,
    fontSize: Constants.headingone,
    margin: 7,
    color: Constants.Secondary,
  },
});

export default EventTickets;
