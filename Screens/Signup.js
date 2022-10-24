import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  LogBox,
  ScrollView

} from "react-native";
import Constants from "../constants/Constants";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import Connection from "../constants/connection";
import * as Animatable from "react-native-animatable";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { AuthContext } from "../Components/context";
import { Caption, } from "react-native-paper";



WebBrowser.maybeCompleteAuthSession();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

function SuccessModal({ visible, children, navigation }) {
  const [showModal, setShowModal] = React.useState(visible);

  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>{children}</View>
      </View>
    </Modal>
  );
}

export default function SignUp({ navigation }) {
  const [visible, setVisible] = React.useState(false);

  const [data, setData] = React.useState({
    mail: "",
    user: "",
    password: "",
    confirmpass: "",
    setPassword: true,
    passConfirm: true,
    check_textInputChange: true,
    isValidName: true,
    isValidEmail: true,
    isValidUser: true,
    isValidPassword: true,
    isValidConfirmation: true,
    error_Message: "",
    email_error: "",
    user_error: "",
    password_error: "",
    confirm_error: "",
    borderColored: false,
    emptyField: "",
    isFieldEmpty: true,
  });

  const emailAddress = (val) => {
    //email address validator
    // var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (val.trim().length >= 8) {
      setData({
        ...data,
        mail: val,
        check_textInputChange: true,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        mail: val,
        check_textInputChange: false,
        isValidEmail: false,
        email_error: "Enter your email address",
      });
    }
  };
  const username = (val) => {
    if (val.length >= 7) {
      setData({
        ...data,
        user: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        user: val,
        check_textInputChange: false,
        isValidUser: false,
        user_error: "Please provide username or Organizer name",
      });
    }
  };
  const passwordChange = (val) => {
    if (val.length >= 7) {
      setData({
        ...data,
        password: val,
        check_textInputChange: true,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        check_textInputChange: false,
        isValidPassword: false,
        password_error: "password must be more 8 letter",
      });
    }
  };
  const confirmPassword = (val) => {
    if (val.length >= 7) {
      setData({
        ...data,
        confirmpass: val,
        check_textInputChange: true,
        isValidConfirmation: true,
      });
    } else {
      setData({
        ...data,
        confirmpass: val,
        check_textInputChange: false,
        isValidConfirmation: false,
        confirm_error: "Confirm password Entry",
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      setPassword: !data.setPassword,
    });
  };
  const confirmPassUpdate = () => {
    setData({
      ...data,
      passConfirm: !data.passConfirm,
    });
  };

  //activity indicator to be shown while the user login
  const [loader, setLoader] = useState(false);
  const InsertRecord = () => {
    var Email = data.mail;
    var User = data.user;
    var passwords = data.password;
    var c_password = data.confirmpass;

    if (
      Email.length == 0 ||
      User.length == 0 ||
      passwords.length == 0 ||
      c_password.length == 0
    ) {
      setData({
        ...data,
        check_textInputChange: false,
        isFieldEmpty: false,
        emptyField: "There is a field left empty",
      });
    } else if (Email.length < 8) {
      setData({
        ...data,
        email_error: "please provide your email address",
      });
    } else if (passwords.length < 8) {
      setData({
        ...data,
        password_error: "please write something overhere!",
      });
    } else if (passwords != c_password) {
      setData({
        ...data,
        isValidConfirmation: false,
        confirm_error: "Password Doesn't match",
      });
    } else {
      setLoader(true);
      var InserAPIURL = Connection.url + Connection.signUp;

      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      var Data = {
        Email: Email,
        User: User,
        passwords: passwords,
      };
      // featch function
      fetch(InserAPIURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data), // CONVERTED to JSON data
      })
        .then((response) => response.json()) //check response type of the API
        .then((response) => {
          let resp = response[0];

          if (resp.message === "successfully Registered") {
            setVisible(true);
            setLoader(false);
          } else {
            setData({
              ...data,
              check_textInputChange: false,
              isFieldEmpty: false,
              emptyField: response[0].message,
            });
            setLoader(false);
          }
        })
        .catch((error) => {
          setLoader(false);
        });
    }
  };

  /********************************************* */
  //google sign up will take place below
  /******************************************** */

  const { GoogleSignIn } = React.useContext(AuthContext);

  const googleSignUp = (id, token, email, googleId) => {
    GoogleSignIn(id, token, email, googleId);
  };

  const [accessToken, setAccessToken] = useState();
  const [featchedInfo, setFeathedInfo] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "799616009286-ck594ue3589h93vq4hlqcsmrg71uuekd.apps.googleusercontent.com",
    iosClientId:
      "799616009286-e19bod10s4h9i6nj8pblrb3haraj4olk.apps.googleusercontent.com",
    androidClientId:
      "799616009286-d8ci42svjmd21h4im7ulas5ajh8qs481.apps.googleusercontent.com",
  });

  //google signin will go here
  const GoogleSignUp = async () => {
    setFeathedInfo(true);
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    userInfoResponse.json().then((data) => {
      //setUserInfoState(data);

      var ApiUrl = Connection.url + Connection.googleSignUp;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      
      //generate random Text to be stored alongside with user info
      const rand = () => {
        return Math.random().toString(36).substring(2);
      };
      const token = () => {
        return rand() + rand();
      };

      // default category place holder

      var category = "Entertainment";

      //dat to be sent to server
      var Data = {
        id: data.id,
        email: data.email,
        name: data.name,
        fatherName: data.family_name,
        kidName: data.given_name,
        token: token(),
        category: category,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json()) //check response type of the API
        .then((response) => {
          let resp = response[0];

          if (resp.message === "successfully Registered") {
            var userInfo = response[0].user[0];
            googleSignUp(
              userInfo.userId,
              userInfo.authentication_key,
              userInfo.email,
              userInfo.google_Id
            );
            navigation.navigate("TabNav");
          } else {
            setData({
              ...data,
              check_textInputChange: false,
              isFieldEmpty: false,
              emptyField: response[0].message,
            });
          }
        })
        .catch((error) => { });
    });
  };

  useEffect(() => {
    if (response?.type === "success") {
      GoogleSignUp();
      setAccessToken(response.authentication.accessToken);
    }

    return () => {};
  });

  return (
    <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
      <SuccessModal visible={visible}>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={styles.closeModal}
        >
          <Ionicons name="close" size={25} color={Constants.mainTwo} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Animatable.Image
            animation="zoomIn"
            style={[styles.successImage, { width: 80, height: 80 }]}
            source={require("../src/success.webp")}
          />
          <Text style={styles.ModalText}>Successfully Registered</Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn")}
              style={styles.modalbtn}
            >
              <Text style={styles.btntext}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SuccessModal>
      <TouchableOpacity
            style={styles.backArrow} // back arrow button style
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={25}
              //back arrow icon
              color= {Constants.Inverse}
            />
          </TouchableOpacity>
      <Image style={styles.loginimage} source={require("../assets/logo.png")} />

      <Caption style={styles.subTitle}>Register and be our valued family</Caption>
      {data.isFieldEmpty ? null : (
        <View style={styles.mainErrorIndicator}>
          <Text style={styles.errorTxt}>{data.emptyField}</Text>
        </View>
      )}


   <View style={styles.emailContainer}>
   <MaterialIcons
          name="alternate-email"
          size={24}
          color={Constants.primary}
        />
      <TextInput
        style={styles.emailAddress}
        placeholder="Email"
        onChangeText={(val) => emailAddress(val)}
      />
     
 </View>
 {data.isValidEmail ? null : (
        <View style={styles.errormsg}>
          <Text style={styles.errorTxt}>{data.email_error}</Text>
        </View>
      )}

 <View style={styles.emailContainer}>
   <MaterialIcons
          name="person"
          size={24}
          color={Constants.primary}
        />
      <TextInput
        style={styles.emailAddress}
        placeholder="Username Or Organizer name"
        onChangeText={(val) => username(val)}
      />

   
       </View>
       {data.isValidUser ? null : (
        <View style={styles.errormsg}>
          <Text style={styles.errorTxt}>{data.user_error}</Text>
        </View>
      )}

      <View style={styles.passwordField}>
      <MaterialIcons
          name="security"
          size={24}
          color={Constants.primary}
        />
        <TextInput
          style={styles.password}
          placeholder="Password"
          secureTextEntry={data.setPassword ? true : false}
          onChangeText={(val) => passwordChange(val)}
        />

        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={updateSecureTextEntry}
        >
          {data.setPassword ? (
            <Ionicons
              name="eye-off-outline"
              size={22}
              color={Constants.Secondary}
              style={styles.showpassword}
            />
          ) : (
            <Ionicons
              name="eye-outline"
              size={22}
              color={Constants.Secondary}
              style={styles.showpassword}
            />
          )}
        </TouchableOpacity>
      </View>
      {data.isValidPassword ? null : (
        <View style={styles.errormsg}>
          <Text style={styles.errorTxt}>{data.password_error}</Text>
        </View>
      )}
      <View style={styles.passwordField}>
      <MaterialIcons
          name="security"
          size={24}
          color={Constants.primary}
        />
        <TextInput
          style={styles.password}
          placeholder="Confirm Password"
          secureTextEntry={data.passConfirm ? true : false}
          onChangeText={(val) => confirmPassword(val)}
        />

        <TouchableOpacity style={styles.eyeIcon} onPress={confirmPassUpdate}>
          {data.passConfirm ? (
            <Ionicons
              name="eye-off-outline"
              size={22}
              color={Constants.Secondary}
              style={styles.showpassword}
            />
          ) : (
            <Ionicons
              name="eye-outline"
              size={22}
              color={Constants.Secondary}
              style={styles.showpassword}
            />
          )}
        </TouchableOpacity>
      </View>
      {data.isValidConfirmation ? null : (
        <View style={styles.errormsg}>
          <Text style={styles.errorTxt}>{data.confirm_error}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.signupbtn} onPress={() => InsertRecord()}>
        {loader ? (
          <ActivityIndicator size="small" color={Constants.Faded} />
        ) : (
          <Text style={styles.signbtntxt}> Register</Text>
        )}
      </TouchableOpacity>
      <Text>Or</Text>

      <TouchableOpacity
        onPress={accessToken ? GoogleSignUp : () => promptAsync()}
        style={styles.google}
      >
        <Image
          source={require("../assets/google.png")}
          style={{ width: 25, height: 25 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        
          {featchedInfo ? (
           <ActivityIndicator size="small" color={Constants.primary}/>
          ) :   
          (
          <Text style={styles.signbtntxt}>
           
          Continue With Google
         </Text>)}
        </View>
      </TouchableOpacity>

      <View style={styles.bottomtxt}>
        <Text>I have an account!</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
          style={styles.txtbtn}
        >
          <Text style={styles.signuplnk}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    
    minHeight:"100%",
    paddingBottom:"45%"
  },
  backArrow: {
    position: "absolute",
    left:5,
    top: 30,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: Constants.background,
    height: 40,
    width: 40,
    borderRadius: 50,
    elevation: 2,
  },
  loginimage: {
    resizeMode: "contain",
    height: "30%",
    width: "80%",
    marginTop:"17%"
  },
  title: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingone,
    color: Constants.primary,
    fontWeight: Constants.Bold,
  },
  emailContainer:{
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"center",
    width: "80%",
    marginTop: 10,
    backgroundColor: Constants.Faded,
    borderRadius: Constants.medium,
    paddingLeft:6,
    borderWidth: 0.5,
    borderColor: Constants.primary,
  },
  emailAddress: {
    padding: Constants.paddTwo,
    fontSize: Constants.headingtwo,
    paddingLeft: 10,
    width: "90%",
  },
  passwordField: {
    flexDirection: "row",
     justifyContent:"space-between",
     alignItems:"center",
     width: "80%",
     marginTop: 15,
     backgroundColor: Constants.Faded,
     borderRadius: Constants.medium,
     paddingLeft:6,
     borderWidth: 0.5,
     borderColor: Constants.primary,
     
   },
   password: {
     padding: Constants.paddTwo,
     fontSize: Constants.headingtwo,
     paddingLeft: 10,
     width: "78%",
 
   },
   eyeIcon: {
     marginRight: 12,
   },
  
  signupbtn: {
 backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    fontSize: Constants.headingtwo,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
   minWidth: 100,
   width: "80%",
  },
  google: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.tiny,
    fontSize: Constants.headingtwo,
    alignItems: "center",
    width: "80%",
    padding: 10,
    marginTop: 5,
    elevation: 4,
    shadowColor: Constants.Secondary,
  
  },
  signbtntxt: {
    color: Constants.Inverse,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    paddingHorizontal: 20,
  },
  forgotpass: {
    marginTop: Constants.marginHead,
  },
  bottomtxt: {
    top: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
  },
  signuplnk: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.primary,
  },
  txtbtn: {
    padding: 10,
    paddingTop: 0,
  },
 
  errormsg: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  errorTxt: {
    color: "red",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Constants.background,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  ModalText: {
    fontSize: Constants.headingone,
    margin: 10,
  },
  buttons: {
    flexDirection: "row",
  },

  modalbtn: {
    bottom: -15,
    backgroundColor: Constants.primary,
    padding: Constants.paddTwo,
    borderRadius: Constants.mediumbox,
    margin: 10,
    marginTop: Constants.marginHead,
    width: "45%",
  },
  btntext: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    textAlign: "center",
  },
  closeModal: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  mainErrorIndicator: {
    marginTop: 15,
    flexDirection: "row",
    alignSelf: "center",
  },
});
