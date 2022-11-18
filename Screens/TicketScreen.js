import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { Button, Paragraph, Title } from "react-native-paper";
import Connection from "../constants/connection";
import Constants from "../constants/Constants";
import TicketListing from "../Components/TicketsListing";


// ticket functional component

function Tickets({ navigation }) {
  const [loading, setLoading] = React.useState(true);
  const [tickets, setTickets] = React.useState();

const myTickets = async()=>{
  let id = await AsyncStorage.getItem("userId");

var ApiUrl = Connection.url+Connection.myTickets;
var headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
};

var Data = {
  id: id
};

fetch(ApiUrl,{
  method: "POST",
  headers: headers,
  body: JSON.stringify(Data),
})
.then((response)=> response.json())
.then((response)=>{ 
  var message = response[0].message;
  var ticket = response[0].Tickets;

  if(message==="succeed"){
    setLoading(true);
    setTickets(ticket);
    
  }
  else{
    setLoading(false);
    console.log(ticket);
  }
})
.catch((error)=> {
  setLoading(false);

});

}

// render ticket listing 
const renderItem=({item})=>(
<TicketListing
event= {item.event_name}
type= {item.tickettype}
price={item.currentprice}

/>
);



useEffect(()=>{

  myTickets();

  return ()=>{}
});

  return (
    <View style={styles.container}>
      {loading ? (
       
        <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
 
  
        // onRefresh={RefreshList}
        // refreshing={refreshing}
        // ListHeaderComponent={() =>
        //   notFound ? (
        //     <View style={styles.noNoticeContainer}>
        //       <Image
        //         source={require("../assets/noNotification.png")}
        //         style={styles.noNoticeImage}
        //         resizeMode="contain"
        //       />
        //       <Title style={styles.prompttxt}>
        //         You have no notification yet!
        //       </Title>
        //     </View>
        //   ) : null
        // }
        // ListFooterComponent={() =>
        //   notFound ? null : (
        //     <View style={styles.listEnd}>
        //       <HelperText>
        //         Notifications from organizers you followed.
        //       </HelperText>
        //     </View>
        //   )
        // }
      />
      ) : (
        <View style={styles.noTicketContainer}>
          <Image
            source={require("../assets/noticket.png")}
            style={styles.noTicketImage}
            resizeMode="contain"
          />
          <Title style={styles.prompttxt}>You have no ticket Yet!</Title>
          <Paragraph>Ticket you added to event is listed here.</Paragraph>
         
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
    paddingVertical:10,

  },
  noTicketContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  noTicketImage: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  prompttxt: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
  eventsBtn: {
    width: "60%",
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: Constants.mediumbox,
    backgroundColor: Constants.primary,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventstxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
  },
});

export default Tickets;
