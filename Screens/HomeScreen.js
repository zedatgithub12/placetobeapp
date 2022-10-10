import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../constants/Constants";
import { Ionicons, FontAwesome5 } from "react-native-vector-icons";
import MyTabs from "./TopTab";
import { Divider, Title } from "react-native-paper";
import { AuthContext } from "../Components/context";
import { LinearGradient } from 'expo-linear-gradient';

function Home({ navigation, ...props }) {

  const { userStatus, userInfoFunction } = React.useContext(AuthContext);

  const profile = () => {
    navigation.navigate("Profile");
  };
  useEffect(()=>{
    userInfoFunction();
  }, [])
  const logged = userStatus.logged;
  return (
    <SafeAreaView style={styles.container}>
      <View
        //to component container
        // profile avatar, App name and serach is included inside the component
        style={styles.headers}
      >
  
               <View style={styles.brands}>
                 <Image source={require("../assets/icon.png")} 
                 resizeMode="cover"
                 style={{width:52, height:52}}
                 />
              <Title style={styles.SearchField}> place to be </Title>
              </View>
        

        <TouchableOpacity
        activeOpacity={0.8}
          style={styles.searchBtn}
          onPress={() => navigation.push("Eventcat")}
        >
             <Ionicons
            name="search-outline"
            size={20}
            color={Constants.primary}
            style={styles.submitIcon}
          />
        </TouchableOpacity>

        {logged ?
  
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => profile()}
    style={styles.profileContainer}
  >
    <Ionicons
      name="person"
      size={22}
      style={styles.profileIcon}
      color={Constants.primary}
    />
  </TouchableOpacity>
  :
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => navigation.navigate("SignIn")}
    style={styles.profileContainer}
  >
    <FontAwesome5
      name="user"
      size={19}
      style={styles.profileIcon}
      color={Constants.Secondary}
    />
  </TouchableOpacity>
}
      </View>


      <Divider style={{ color: Constants.primary}}/>
      <LinearGradient
        // Button Linear Gradient
        colors={[Constants.primaryTwo, Constants.primary, Constants.transparentPrimary]}
        
       style={styles.PrimaryTitle}>
        <Text style={styles.PrimaryTitleText}>Featured Events</Text><Ionicons name="star" size={24} color={Constants.background} />
     
</LinearGradient>
      <MyTabs
      // This component contain the tabs of Event which is filtered by status of
      // Today, This Week, Upcoming events
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
  },
  headers: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: Constants.paddTwo,
    alignSelf: "center",
    marginBottom: 10,
  },
  SearchFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    backgroundColor: Constants.background,
    borderRadius: 50,
    paddingLeft: 10,
  },
  brands:{
      flexDirection:"row",
      alignItems:"center",
    
  },
  SearchField: {
    width: "64%",
    fontWeight:Constants.Bold,
    fontFamily:Constants.fontFam,
    fontSize:Constants.headingone,
  },
  profileContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: Constants.Faded,
    padding: 4,
    elevation: 2,
    shadowColor: Constants.Faded,
    marginRight:8,
  
  },
  profileImage: {
    alignSelf: "center",
  },

  PrimaryTitle: {
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    alignSelf: "center",
   
    padding: 20,
    backgroundColor: Constants.Faded,
    width:"90%",
    margin:10,
    marginTop:12,
    borderRadius:Constants.tinybox,
    
  },
  PrimaryTitleText: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    marginLeft: 10,
    color: Constants.Inverse
  },
  searchBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    backgroundColor:Constants.Faded,
    borderRadius:50,
    marginRight:8
  },
  statusFilter: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: Constants.padd,
    marginTop: 5,
  },
  statusFilterBtn: {
    width: "23%",
    backgroundColor: Constants.backgroundtwo,
    borderRadius: Constants.mediumbox,
    justifyContent: "center",
    alignItems: "center",
  },
  statusFilterTxt: {
    fontWeight: Constants.Bold,
  },
  statusFilterCalendar: {
    width: "15%",
    backgroundColor: Constants.background,
    borderRadius: Constants.mediumbox,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
