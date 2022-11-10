import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Paragraph, Title,  } from "react-native-paper";
import Constants from "../constants/Constants";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Forms from "../src/FormArray";
import Carousel from "react-native-snap-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Components/context";
import Connection from "../constants/connection";
import * as Animatable from "react-native-animatable";
import { ScrollView } from "react-native-gesture-handler";

class EventSubmission extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.state = {
      next: "Next",
      submit: "Submit",
      ActiveIndex: 0,
      signed: null,
      userId: "",
      featuredImage: "",
      eventTitle: "",
      eventDescription: "",
      startingDay: "",
      startingTime: "",
      endingDay: "",
      endingTime: "",
      eventOrg: "",
      eventCat: "",
      eventAddr: "",
      entranceFee: "",
      locationLatitude: "",
      locationLongitude: "",
      contactPhone: "",
      redirectLink: "",
      visible: false,
      added: false,
      error: false,
      responseMessage: "",
      posting: false,
    };
  }
  getData = async () => {
    try {
      const userTokens = await AsyncStorage.getItem("userToken");
      if (userTokens !== null) {
        this.setState({ signed: userTokens });
        // We have data!!
        
      }
    } catch (error) {
      // Error retrieving data
      
    }
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const { InputForm, userStatus} = this.context;
    const logged = userStatus.logged;
    const renderItem = ({ item, index }) => <View>{item.form}</View>;
    const windowWidth = Dimensions.get("window").width;

    // modal function which is going to be called when event successfully added database
    const successModal = (returnedResponse) => {
      this.setState({ error: false, added: true, responseMessage: returnedResponse });
    };
    const closePrompt = () => {
      this.setState({ added: false });
    };
    const errorPanel = (returnedResponse) => {
      this.setState({
        added: false, error: true, responseMessage: returnedResponse,
      });
    };
     
    // closer error modal
    const closeError = () => {
      this.setState({ error: false });
    };
// state of event posting icon


    const PostEvent = async () => {
this.setState({posting:true});
          // we retrived usertoken from async storage and store it in global scope
      let id = await AsyncStorage.getItem("userId");
     
      var userId = id;
      var picture = (this.state.featuredImage = InputForm.FeaturedImage);
      var name = (this.state.eventTitle = InputForm.eventNamed);
      var about = (this.state.eventDescription = InputForm.aboutEvent);
      var startD = (this.state.startingDay = InputForm.sDate);
      var startT = (this.state.startingTime = InputForm.sTime);
      var endD = (this.state.endingDay = InputForm.eDate);
      var eTime = (this.state.endingTime = InputForm.eTime);
      var eventOrganizers = (this.state.eventOrg = InputForm.eOrg);
      var eventCategories = (this.state.eventCat = InputForm.eCat);
      var eventVenuesAddress = (this.state.eventAddr = InputForm.eAddress);
      var eventFee = (this.state.entranceFee = InputForm.TicketPrice);
      var latitude = (this.state.locationLatitude = InputForm.mLat);
      var longitude = (this.state.locationLongitude = InputForm.mLong);
      var organizerPhone = (this.state.contactPhone = InputForm.cPhone);
      var redirectUrl = (this.state.redirectLink = InputForm.url);
       

     
      // event field validation
      if (
        picture.length == 0 ||
        name.length == 0 ||
        about.length == 0 ||
        startD.length == 0 ||
        startT.length == 0 ||
        endD.length == 0 ||
        eTime.length == 0 ||
        eventOrganizers.length == 0 ||
        eventCategories.length == 0 ||
        eventVenuesAddress.length == 0
      ) {
        let blankField = "There is a field left blank";
        errorPanel(blankField);
        this.setState({posting:false});
      } else {
        // After this we initiate featch method to send user data to database
        var InsertAPIUrl = Connection.url + Connection.AddEvent;
        // header type for text data to be send to server
        var headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        // data to be stored in the database
        var Data = {
          userId: userId,
          picture: picture,
          name: name,
          about: about,
          startD: startD,
          startT: startT,
          endD: endD,
          eTime: eTime,
          eventOrganizers: eventOrganizers,
          eventCategories: eventCategories,
          eventVenuesAddress: eventVenuesAddress,
          eventFee: eventFee,
          latitude: latitude,
          longitude: longitude,
          organizerPhone: organizerPhone,
          redirectUrl: redirectUrl,
          status: "0",
        };
        // fetch function
        fetch(InsertAPIUrl, {
          method: "POST", // method used to store data in the database
          headers: headers, // header type which we declare on the top will be assign to headers
          body: JSON.stringify(Data), // a data will be converted to json format
        })
          .then((response) => response.json()) //check response type of the API
          .then((response) => {
            let returnedResponse = response[0];
            let message = returnedResponse.message;
            if (message === "successfully Added") {
              successModal(message);
              this.setState({posting:false});
            } else {
              errorPanel(message);
              this.setState({posting:false});
            }
          })
          .catch((err)=>{
           
          });
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container} >
        {this.state.added ? (
          <Animatable.View animation="fadeInUp" style={styles.successPrompt}>
            <TouchableOpacity
              onPress={() => closePrompt()}
              style={styles.closePrompt}
            >
              <Ionicons name="close" size={25} color={Constants.background} />
            </TouchableOpacity>
            <Text style={styles.promptText}>{this.state.responseMessage}</Text>
          </Animatable.View>
        ) : null}

        {this.state.error ? (
          <Animatable.View animation="fadeInUpBig" style={styles.errorPrompt}>
            <TouchableOpacity
              onPress={() => closeError()}
              style={styles.closePrompt}
            >
              <Ionicons name="close" size={25} color={Constants.background} />
            </TouchableOpacity>
            <Text style={styles.promptText}>{this.state.responseMessage}</Text>
          </Animatable.View>
        ) : null}

        {logged ? (
          <View>
            <Carousel
              ref={(ref) => (this.carousel = ref)}
              data={Forms}
              renderItem={renderItem}
              sliderWidth={windowWidth}
              itemWidth={windowWidth}
              directionalLockEnabled={false}
              onSnapToItem={(index) => this.setState({ ActiveIndex: index })}
            />

            <View style={styles.SliderActionBtns}>
              {this.state.ActiveIndex != 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.carousel._snapToItem(this.state.ActiveIndex - 1)
                  }
                  activeOpacity={0.7}
                  style={styles.backButton}
                >
                  <MaterialCommunityIcons name="arrow-left" size={26} color={Constants.Inverse}/>
                </TouchableOpacity>
              ) : null}

              {this.state.ActiveIndex.valueOf() !== 3 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.carousel._snapToItem(this.state.ActiveIndex + 1)
                  }
                  activeOpacity={0.7}
                  style={styles.nextButton}
                >
                  <MaterialCommunityIcons name="arrow-right" size={26} color={Constants.background}/>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  //event submit button
                  onPress={() => PostEvent()}
                  activeOpacity={0.7}
                  style={styles.submitButton}
                >
                  {
                    this.state.posting ? (
                      <ActivityIndicator
                      size="small"
                      color={Constants.Faded}
                      />
                    )
                    :(
                      <Ionicons name="md-checkmark-sharp" size={26} color={Constants.background}/>
                    )
                  }
                 
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <View style={styles.notLogedPrompt}>
            <FontAwesome5
              name="exclamation-circle"
              size={66}
              color={Constants.background}
            />

            <Title style={styles.prompttxt}>Please Login First!</Title>
            <Paragraph style={styles.helperText}>
              To post event on Place to be Ethiopia you must have a user account.
            </Paragraph>

            <View style={styles.actionBtns}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.createAccountBtn}
                onPress={() => this.props.navigation.navigate("SignUp")}
              >
                <Text style={styles.btnTxt}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SignIn")}
                activeOpacity={0.7}
                style={styles.LoginBtn}
              >
                <Text style={styles.btnTxt}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        )}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
     minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
  
  },
  SliderActionBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
    marginBottom:180,
  },
  backButton: {
    position: "absolute",
    top:0,
    left:40,
    width: 50,
    height:50,
    borderRadius: 25,
    backgroundColor: Constants.Faded,
    justifyContent:"center",
    alignItems: "center",
    marginTop: 6,
    borderWidth:1,
    borderColor: Constants.purple,
    elevation:2,
  },
  nextButton: {
    position: "absolute",
    top:0,
    right:40,
    width: 50,
    height:50,
    borderRadius: 25,
    backgroundColor: Constants.purple,
    justifyContent:"center",
    alignItems: "center",
    marginTop: 6,
    borderWidth:4,
    borderColor: Constants.purple
  },
  submitButton: {
    position: "absolute",
    top:0,
    right:40,
    width: 50,
    height:50,
    borderRadius:25,
    backgroundColor: Constants.green,
    alignItems: "center",
   justifyContent:"center",
    borderWidth:3,
    borderColor: Constants.green,
    marginTop: 6,
  },
  nextBtnTxt: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.background,
  },
  notLogedPrompt: {
    
    height: 300,
    width: 300,
    alignItems: "center",
    alignSelf:"center",
  
    backgroundColor: Constants.purple,
    borderRadius: Constants.borderRad,
    elevation: 10,
    padding: 15,
    shadowColor:Constants.Secondary
   
  },
  prompttxt: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    marginTop: 10,
    color:Constants.background
  },
  actionBtns: {
    position: "absolute",
    bottom: 25,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createAccountBtn: {
    width: "50%",
    backgroundColor: Constants.background,
    borderRadius: Constants.tiny,
    padding: 10,
    alignItems: "center",
    elevation: 1,
   
  },
  LoginBtn: {
    width: "38%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    padding: 6,
  },
  btnTxt:{
 fontSize:Constants.headingthree,
 fontWeight: Constants.Bold,
 color:Constants.Inverse
  },
  helperText: {
    width: "90%",
    textAlign: "center",
    marginTop: 10,
    color:Constants.background
  },
  successPrompt: {
    position: "absolute",
    bottom: 190,
    zIndex: 100,
    width: "85%",
    backgroundColor: Constants.Success,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: Constants.tiny,
    elevation: 4,
    shadowColor: Constants.Secondary,
    shadowOffset: {
      height: 8,
      width: 2,
    },
  },
  closePrompt: {
    position: "absolute",
    right: 15,
    top: 5,
  },
  promptText: {
    color: Constants.background,
    fontWeight:Constants.Bold,
  },
  errorPrompt: {
    position: "absolute",
    bottom: 190,
    zIndex: 100,
    width: "85%",
    backgroundColor: Constants.Danger,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: Constants.tiny,
    elevation: 4,
    shadowColor: Constants.Secondary,
    shadowOffset: {
      height: 8,
      width: 2,
    },
  },
});
export default EventSubmission;
