import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTicketTotal } from "../Reducer/Ticket";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "react-native-vector-icons";

function CheckoutScreen({ navigation, route }) {
  // const { totalCount, totalAmount } = useSelector((state) => state.ticket);
  // const { items } = useSelector((state) => state.ticket);
  // const dispatch = useDispatch()
  // useEffect(() => {
  //     dispatch(getTicketTotal());
  // }, [items]);
  const selectedTicket = route.params;

  const [value, setValue] = React.useState("first");
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    console.log(selectedTicket);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={{ height: 100 }}>
        {selectedTicket.map(
          (item) =>
           (
              <View style={styles.ticketcheckout}>
                <View style={styles.leftCheckout}>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      {item.currentprice}
                    </Text>
                    <Text>{item.tickettype}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    padding: 5,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 17,
                      paddingRight: 8,
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 5,
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome name="ticket" size={18} color="black" />
                    <Text
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "green",
                        fontSize: 17,
                        paddingRight: 8,
                        fontWeight: "bold",
                      }}
                    >
                      {item.currentprice}
                    </Text>
                    <Text>{item.originalprice} Birr</Text>
                  </View>
                </View>
              </View>
            )
        )}
     

      <View style={styles.btnGroup}>
        <TouchableOpacity
          style={[
            styles.btn,
            selection === 1
              ? [
                  { backgroundColor: "#ebebeb" },
                  { borderWidth: 1 },
                  { borderColor: "green" },
                ]
              : { backgroundColor: "white" },
          ]}
          onPress={() => setSelection(1)}
        >
          <View style={styles.LeftPayment}>
            <Image
              style={styles.Paymentlogo}
              source={{
                uri: "https://play-lh.googleusercontent.com/Mtnybz6w7FMdzdQUbc7PWN3_0iLw3t9lUkwjmAa_usFCZ60zS0Xs8o00BW31JDCkAiQk",
              }}
            />
            <Text
              style={[
                styles.btnText,
                selection === 1 ? { color: "black" } : null,
              ]}
            >
              Telebirr
            </Text>
          </View>
          {selection === 1 ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={32}
              color="green"
            />
          ) : (
            <MaterialCommunityIcons
              name="radiobox-blank"
              size={32}
              color="#ffbb00"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            selection === 2
              ? [
                  { backgroundColor: "#ebebeb" },
                  { borderWidth: 1, borderColor: "green" },
                ]
              : { backgroundColor: "white" },
          ]}
          onPress={() => setSelection(2)}
        >
          <View style={styles.LeftPayment}>
            <Image
              style={styles.Paymentlogo}
              source={{
                uri: "https://addisbiz.com/wp-content/uploads/Commercial-Bank-logo-1280x720.jpg",
              }}
            />
            <Text
              style={[
                styles.btnText,
                selection === 2 ? { color: "black" } : null,
              ]}
            >
              CBE
            </Text>
          </View>
          {selection === 2 ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={32}
              color="green"
            />
          ) : (
            <MaterialCommunityIcons
              name="radiobox-blank"
              size={32}
              color="#ffbb00"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            selection === 3
              ? [
                  {
                    backgroundColor: "#ebebeb",
                    borderWidth: 1,
                    borderColor: "green",
                  },
                ]
              : { backgroundColor: "white" },
          ]}
          onPress={() => setSelection(3)}
        >
          <View style={styles.LeftPayment}>
            <Image
              style={styles.Paymentlogo}
              source={{
                uri: "https://play-lh.googleusercontent.com/GEjGBnUGMkupE8FpnT9LiqSzuS-_1n2sms1xJu8sPKp-JQsA92u8Fl-pKuk0E_x4SmM",
              }}
            />
            <Text
              style={[
                styles.btnText,
                selection === 3 ? { color: "black" } : null,
              ]}
            >
              CBE
            </Text>
          </View>
          {selection === 3 ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={32}
              color="green"
            />
          ) : (
            <MaterialCommunityIcons
              name="radiobox-blank"
              size={32}
              color="#ffbb00"
            />
          )}
        </TouchableOpacity>
      </View>
      </View>
      {selection && (
        <View style={{ marginHorizontal: 10 }}>
          <Button
            color="#ffbb00"
            title="Pay"
            onPress={() => navigation.navigate("RewardScreen")}
            style={styles.paybuttonStyle}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  paybuttonStyle: {
    width: 50,
    marginHorizontal: 100,
  },
  Paymentlogo: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  LeftPayment: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnGroup: {
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    height: "auto",
    width: "100%",

    alignItems: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  btn: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    flexDirection: "row",
    marginVertical: 10,
  },
  btnText: {
    // textAlign: 'center',
    fontWeight: "bold",

    fontSize: 14,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
  },
  leftCheckout: {
    flexDirection: "row",
  },
  ticketcheckout: {
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#FFE499",
  },
  imageContainer: {
    alignItems: "center",
    height: 50,
    width: 50,
    paddingRight: 10,
  },
  image: {
    borderRadius: 10,
    height: 50,
    resizeMode: "cover",
    width: 50,
  },
});

export default CheckoutScreen;
