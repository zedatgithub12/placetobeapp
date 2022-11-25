import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import {
  addTicket,
  decrease,
  getTicketTotal,
  increase,
  newItem
} from "../Reducer/Ticket";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Icon,
} from "react-native-vector-icons";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import Dummy from '../src/ticketsDummy';

const PaymentScreen = () => {
  var placeholder = "placeholder.png";
  var featuredImageUri = Connection.url + Connection.assets + placeholder;


  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.ticket);

  const { totalCount, totalAmount } = useSelector((state) => state.ticket);
  const [dummy, setTickets] = useState(Dummy);

  useEffect(() => {
    dispatch(addTicket(dummy));
  }, [dummy]);

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

  //Chaing the color of icons
  useEffect(() => {
    dispatch(getTicketTotal());
  }, [dummy]);

  //let color;
  const colors = (c) => {
    var color;
    switch (c) {
      case 0:
        color = "#FF5C00";

        break;
      case 1:
        color = "#5FD855";

        break;

      case 2:
        color = "#8F00FF";
        break;
      case 3:
        color = "#8F00FF";
        break;
      case 4:
        color = "#8F00FF";
        break;

      default:
        console.log("Invalid operator");
        break;
    }
    return color;
  };

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
                uri: featuredImageUri,
              }}
            />
          </View>

           <View style={[styles.DiscriptionText]}>


          <View>
            <Text style={[styles.H1Text]}>በርሜል Fest</Text>
            </View>

            {/* <View style={[styles.Date]}>
              <Icon name="calendar" size={20} color={Constants.primary} />
              <Text style={[styles.H4Text]}>Sun, Nov 13 (2 AM)Lt</Text>
            </View>


            <View style={[styles.Date]}>
              <Icon name="map-marker" size={20} color={Constants.primary} />
              <Text style={[styles.H4Text]}>Ghion Hotel</Text>
            </View> */}


          </View> 
        </View>
     


        <Text style={[styles.H1Text, { marginLeft: 20 }]}>
          Avaliable Tickets
        </Text>

        {dummy.map((tik, index) => (
          <View
            key={index}
            style={[
              styles.TicketView,
              active === index
                ? { borderLeftWidth: 3, borderLeftColor: "#ffbb00" }
                : null,
            ]}
          >
            <View style={styles.LeftTicket}>
              <View style={styles.IconWrapper}>
                
                <FontAwesome name="ticket" size={22} color={colors(index)} />
              </View>

              <View>
                <Text style={styles.productTitle}>{tik.title}</Text>
                {tik.amount !== 0 ? (
                  <View>
                    <Text
                      style={[
                        styles.price,
                        tik.amount !== 0
                          ? { color: "black" }
                          : { color: "black" },
                      ]}
                    >
                      {`${tik.price * tik.amount}`} Birr
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.price}>{tik.price} Birr</Text>
                )}
              </View>
            </View>

            <View style={styles.productRightView}>
              {
                active == index ? (
                  
                    <View style={styles.productItemCounterView}>
                      <View style={styles.counterButton}>
                        <TouchableOpacity
                          onPress={() => {
                            if (tik.amount < 2) {
                              setActiveIndex(null);
                              setDisable(false);
                            }
                            tik.amount > 0 && dispatch(decrease(tik.id));
                          }}
                        >
                          <MaterialCommunityIcons
                            name="minus-thick"
                            size={22}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.amountcounterButton}>
                        <Text style={[styles.counterValue]}>{tik.amount}</Text>
                      </View>

                      <View style={styles.counterButton}>
                        <TouchableOpacity
                          onPress={() => {
                            setDisable(true);
                        
                            dispatch(increase(tik.id));
                          }}
                        >
                          <MaterialCommunityIcons
                            name="plus-thick"
                            size={22}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                
                ) : (
                  <Button
                    onPress={() => {
                      setActiveIndex(index);
                      dispatch(newItem(tik.id))
                      handlechange(index);
                      console.log(index);
                    }}
                    disabled={disable}
                    title="buy"
                    color="#ffbb00"
                    accessibilityLabel="Buy"
                    paddingHorizontal="20"
                  />
                )
               
              }
            </View>
          </View>

          // <AvaliableTickets key={tik.id} ticket={tik} />
        ))}


      </View>

      {disable && (
        <View style={[styles.bottomNavigationView]}>
          <View></View>
          <View style={[{ flexDirection: "row" }, { alignItems: "center" }]}>
            <FontAwesome name="ticket" size={22} color="white" />
            <Text style={styles.BSTicketcount}>{totalCount}</Text>
          </View>

          <View style={styles.LeftbottomNavigationView}>
            <Text style={styles.BStext}>Total:</Text>

            <Text style={styles.BSTicketTotal}>{totalAmount} Birr</Text>
          </View>
          <TouchableOpacity
            // onPress={() => {
            //   navigation.navigate("Checkout Screen");
            // }}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Countinue</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  counterButton: {
    backgroundColor: "#ffbb00",
    borderRadius: 5,
    padding: 5,
  },
  amountcounterButton: {
    backgroundColor: "white",

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
    borderColor: "#d3d3d3",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 35,
    width: 35,
    backgroundColor: "#FDF8E2",
    borderRadius: 50,
  },
  cartTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 10,
  },
  TicketView: {
    borderLeftColor: "black",

    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: "#333",
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
    color: "#ffbb00",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "600",
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

  ///
  Main: {
    flex: 1,
    alignItems: "center",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
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
  BStext: {},
  BStext: {
    fontSize: 20,
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
    backgroundColor: "#535353",
    width: "100%",
    height: 70,
    position: "absolute",
    bottom: 0,
    margin: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketsdescription: {
    margin: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    width: "100%",
  },
  imageContainer: {
    paddingLeft: 10,
    display: "flex",
    flex: 1,
    height: "100%",
    width: "30%",
  },
  image: {
    borderRadius: 15,
    height: "100%",
    resizeMode: "cover",
    width: "100%",
  },
  DiscriptionText: {
    display: "flex",
    flex: 1,
    marginLeft: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    // justifyContent: 'space-around',
    spacing: 2,
    height: "100%",
    width: "50%",
  },
  H1Text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  H4Text: {
    fontSize: 15,
    color: "grey",
    paddingLeft: 10,
  },
  Date: {
    marginTop: 40,
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
});

export default PaymentScreen;
