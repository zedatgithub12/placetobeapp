import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Paragraph, Title } from "react-native-paper";
import Constants from "../../constants/Constants";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Forms from "../../Components/Forms";
import Carousel from "react-native-snap-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Components/context";
import Connection from "../../constants/connection";
import * as Animatable from "react-native-animatable";
import { ScrollView } from "react-native-gesture-handler";
import NotLoggedIn from "../../handlers/auth";

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
      PosterStatus: false,
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
    const { InputForm, userStatus } = this.context;
    const logged = userStatus.logged;
    const renderItem = ({ item, index }) => <View>{item.form}</View>;
    const windowWidth = Dimensions.get("window").width;

    // modal function which is going to be called when event successfully added database
    const successModal = (returnedResponse) => {
      this.setState({
        error: false,
        added: true,
        responseMessage: returnedResponse,
      });
    };
    const closePrompt = () => {
      this.setState({ added: false });
    };
    const errorPanel = (returnedResponse) => {
      this.setState({
        added: false,
        error: true,
        responseMessage: returnedResponse,
      });
    };

    // closer error modal
    const closeError = () => {
      this.setState({ error: false });
    };
    // state of event posting icon

    const PostEvent = async () => {
      // we retrived usertoken from async storage and store it in global scope
      let id = await AsyncStorage.getItem("userId");
      var userId = id;
      var picture = InputForm.poster;
      var name = InputForm.eventNamed;
      var description = InputForm.aboutEvent;
      var startD = InputForm.sDate;
      var startT = InputForm.sTime;
      var endD = InputForm.eDate;
      var eTime = InputForm.eTime;
      var eventOrganizers = InputForm.eOrg;
      var eventCategories = InputForm.eCat;
      var eventVenuesAddress = InputForm.eAddress;
      var eventFee = InputForm.TicketPrice;
      var latitude = InputForm.mLat;
      var longitude = InputForm.mLong;
      var organizerPhone = InputForm.cPhone;
      var redirectUrl = InputForm.url;

      // event field validation
      if (
        picture == null ||
        name.length == 0 ||
        description.length == 0 ||
        startD.length == 0 ||
        startT.length == 0 ||
        endD.length == 0 ||
        eTime.length == 0 ||
        eventOrganizers.length == 0 ||
        eventCategories.length == 0 ||
        eventVenuesAddress.length == 0
      ) {
        let blankField = "Please enter all requested informations";
        errorPanel(blankField);
      } else {
        this.setState({ posting: true });
        // After this we initiate featch method to send user data to database
        var Api = Connection.url + Connection.AddEvent;
        let localUri = picture.uri; // local image uri
        let filename = localUri.split("/").pop(); // the filename is stored in filename variable
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let kind = match ? `image/${match[1]}` : `image`;

        // data to be stored in the database
        const data = new FormData();
        data.append("userId", userId);
        data.append("picture", { picture });
        data.append("name", name);
        data.append("about", description);
        data.append("startD", startD);
        data.append("startT", startT);
        data.append("endD", endD);
        data.append("eTime", eTime);
        data.append("eventOrganizers", eventOrganizers);
        data.append("eventCategories", eventCategories);
        data.append("eventVenuesAddress", eventVenuesAddress);
        data.append("eventFee", eventFee);
        data.append("latitude", latitude);
        data.append("longitude", longitude);
        data.append("organizerPhone", organizerPhone);
        data.append("redirectUrl", redirectUrl);
        data.append("status", "0");

        // fetch function
        fetch(Api, {
          method: "POST", // method used to store data in the database
          body: data,
        })
          .then((response) => response.json()) //check response type of the API
          .then((response) => {
            console.log(response);
            if (response.success) {
              successModal(response.message);
              this.setState({ posting: false });
            } else {
              errorPanel(message);
              this.setState({ posting: false });
            }
          })
          .catch((error) => {
            this.setState({ posting: false });
            console.error("Error posting data:", error);
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          });
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
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
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={26}
                    color={Constants.Inverse}
                  />
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
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={26}
                    color={Constants.background}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  //event submit button
                  onPress={() => PostEvent()}
                  activeOpacity={0.7}
                  style={styles.submitButton}
                >
                  {this.state.posting ? (
                    <ActivityIndicator size="small" color={Constants.Faded} />
                  ) : (
                    <Ionicons
                      name="md-checkmark-sharp"
                      size={26}
                      color={Constants.background}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <NotLoggedIn
            helpertext="To post event on Place to be Ethiopia you must have a user account."
            signUp={() => this.props.navigation.navigate("SignUp")}
            signIn={() => this.props.navigation.navigate("SignIn")}
          />
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
    backgroundColor: Constants.Faded,
  },
  SliderActionBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
    marginBottom: 180,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Constants.Faded,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: Constants.purple,
    elevation: 2,
  },
  nextButton: {
    position: "absolute",
    top: 0,
    right: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Constants.purple,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    borderWidth: 4,
    borderColor: Constants.purple,
  },
  submitButton: {
    position: "absolute",
    top: 0,
    right: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Constants.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Constants.green,
    marginTop: 6,
  },
  nextBtnTxt: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.background,
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
    fontWeight: Constants.Bold,
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
