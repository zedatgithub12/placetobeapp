import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  LogBox
} from "react-native";
import Constants from "../constants/Constants";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import { AuthContext } from "../Components/context";
import Connection from "../constants/connection";
import { ActivityIndicator, Caption } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";


WebBrowser.maybeCompleteAuthSession();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function Signin({ navigation }) {
  //userInput login
  const { SignIn } = React.useContext(AuthContext);
  const loginState = (userId, userToken, userEmail, password) => {
    SignIn(userId, userToken, userEmail, password);
  };

  const [data, setData] = React.useState({
    email: "",
    password: "",
    secureTextEntry: true,
    check_textInputChange: false,
    isValidEmail: true,
    isValidPassword: true,
    email_error: "",
    pass_error: "",
    message: "",
    messageType: "",
    googleSubmitting: false,
  });
  // onchange username this function is triggered
  const textInputChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };
  //on password change this function is triggered

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  // manual sign in function

  const [loading, setLoading] = useState(false);

  const validate = () => {
    var Email = data.email;
    var password = data.password;

    if (data.email == 0) {
      setData({
        ...data,
        isValidEmail: false,
        email_error: "Please provide your email address",
      });
    } else if (data.password == 0) {
      setData({
        ...data,
        isValidEmail: false,
        email_error: "Please provide your password",
      });
    } else {
      setLoading(true);
      var InserAPIURL = Connection.url + Connection.signIn;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      var Data = {
        Email: Email,
        password: password,
      };
      fetch(InserAPIURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          var resp = response[0];

          if (resp.message === "succeed") {
            var userId = response[0].userId;
            var userToken = response[0].userToken;
            var userEmail = response[0].email;
            var profile = response[0].profile;
            var username = response[0].username;
            var First_Name = response[0].First_Name;
            var Middle_Name = response[0].Middle_Name;
            var lastName = response[0].lastName;
            var gender = response[0].gender;
            var category = response[0].category;
            var phone = response[0].phone;
            var status = response[0].status;

            loginState(
              userId,
              userToken,
              userEmail,
              data.password,
              profile,
              username,
              First_Name,
              Middle_Name,
              lastName,
              gender,
              category,
              phone,
              status
            );
            navigation.navigate("TabNav");
            setLoading(false);
          } else {
            setData({
              ...data,
              isValidEmail: false,
              email_error: resp.message,
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log("Error occured" + error);
          setLoading(false);
        });
    }
  };

  /********************************************* */
  //google signin will go here
  /******************************************** */

  const { GoogleSignIn } = React.useContext(AuthContext);

  const googleSignUp = (id, token, email, googleId) => {
    GoogleSignIn(id, token, email, googleId);
  };

  const [accessToken, setAccessToken] = useState(); //access token state initialisation
  //const [userInfoState, setUserInfoState] = useState(); // userInfo state initialisation
const [googleLoader, setGoogleLoader] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "799616009286-ck594ue3589h93vq4hlqcsmrg71uuekd.apps.googleusercontent.com",
    iosClientId:
      "799616009286-e19bod10s4h9i6nj8pblrb3haraj4olk.apps.googleusercontent.com",
    androidClientId:
      "799616009286-d8ci42svjmd21h4im7ulas5ajh8qs481.apps.googleusercontent.com",
  });

  const GoogleSignInBtn = async () => {
    setGoogleLoader(true);
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    userInfoResponse.json().then((data) => {
      // setUserInfoState(data);

      var ApiUrl = Connection.url + Connection.googleSignIn;
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

      var category = "Select Category";
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
          
          if (resp.message === "succeed") {
            var userInfo = response[0].user[0];
            googleSignUp(
              userInfo.userId,
              userInfo.authentication_key,
              userInfo.email,
              userInfo.google_Id
            );
            navigation.navigate("TabNav");
          } 
          else if (resp.message === "successfully Registered") {
            var userInfo = response[0].user[0];
            googleSignUp(
              userInfo.userId,
              userInfo.authentication_key,
              userInfo.email,
              userInfo.google_Id
            );
            navigation.navigate("TabNav");
          }
          
          else {
            setData({
              ...data,
              check_textInputChange: false,
              isFieldEmpty: false,
              emptyField: response[0].message,
             
            });
            setGoogleLoader(false);
          }
        })
        .catch((error) => {});

       
    });

  };

  //handle response message
  /*  const handleMessage = (message, type = "FAILED") => {
    setData({
      ...data,
      message: message,
      messageType: type,
    });
  };
*/
  React.useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      GoogleSignInBtn();
     
    }

    return () => {};
  
  });

  return (
    <View style={styles.container}>
      <Image style={styles.loginimage} source={require("../src/login.png")} />
      <Text style={styles.title}>p2b-Ethiopia</Text>
      <Caption style={styles.subTitle}>Sign In with your email address</Caption>

      {data.isValidEmail ? null : (
        <View style={styles.error_Message}>
          <Text style={styles.errorTxt}>{data.email_error}</Text>
        </View>
      )}
      <TextInput
        style={styles.emailAddress}
        placeholder="Enter Your Email Address"
        onChangeText={(val) => textInputChange(val)}
      />

      <View style={styles.viewPassword}>
        <TextInput
          style={styles.password}
          placeholder="Enter Your Password"
          keyboardType="numeric"
          secureTextEntry={data.secureTextEntry ? true : false}
          onChangeText={(val) => handlePasswordChange(val)}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={updateSecureTextEntry}
        >
          {data.secureTextEntry ? (
            <Ionicons
              name="eye-off-outline"
              size={22}
              color={Constants.mainText}
              style={styles.showpassword}
            />
          ) : (
            <Ionicons
              name="eye-outline"
              size={22}
              color={Constants.mainText}
              style={styles.showpassword}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
          style={styles.gobackBtn}
        >
          <Text style={styles.signbtntxt}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => validate()}
          style={styles.signinbtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Constants.Faded} />
          ) : (
            <Text style={styles.signbtntxt}> Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text>Or</Text>

      {!data.googleSubmitting && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.google}
          onPress={accessToken ? GoogleSignInBtn : () => promptAsync()}
        >
          <Image
            source={require("../assets/google.png")}
            style={{ width: 25, height: 25 }}
          />
          {
            googleLoader ?
            (
              <ActivityIndicator size="small" color={Constants.primary}/>
            )
            :
            <Text style={styles.signbtntxt}>
            Continue With Google
          </Text>
          }
          
          {/*accessToken ?(<MaterialCommunityIcons name="check-circle" size={18} style={styles.ContinueIcon} color={Constants.Success}/>): null*/}
        </TouchableOpacity>
      )}

      {data.googleSubmitting && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.google}
          disabled={true}
        >
          <ActivityIndicator size="small" color={Constants.primary} />
        </TouchableOpacity>
      )}

      <TouchableOpacity 
       activeOpacity={0.5}
       onPress={()=> navigation.navigate("ForgotPass")}
       >
        <Text style={styles.forgotpass}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.bottomtxt}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signuplnk}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
  },
  loginimage: {
    resizeMode: "contain",
    height: "28%",
  },
  title: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingone,
    color: Constants.primary,
    fontWeight: Constants.Bold,
  },
  emailAddress: {
    backgroundColor: Constants.Faded,
    borderRadius: Constants.borderRad,
    padding: Constants.paddTwo,
    fontSize: Constants.headingtwo,
    width: "90%",
    paddingLeft: 30,
    marginTop: 10,
  },
  error_Message: {
    marginTop: 20,
    flexDirection: "row",
  },
  errorTxt: {
    color: Constants.red,
  },
  subTitle: {
    color: Constants.Secondary,
  },
  password: {
    fontSize: Constants.headingtwo,
    width: "75%",
    paddingLeft: 20,
  },
  buttonContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin:10,
  },
  gobackBtn: {
   
    backgroundColor: Constants.Faded,
    borderRadius: Constants.mediumbox,
    fontSize: Constants.headingtwo,
    alignItems: "center",
    justifyContent: "center",

    shadowColor:Constants.Secondary,
    marginTop: 20,
    padding: 8,
    minWidth:100,
  },
  signinbtn: {
   
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    fontSize: Constants.headingtwo,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 8,
    minWidth:100,
  },
  signbtntxt: {
    color: Constants.Inverse,
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    paddingHorizontal: 20,
  },
  google: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.borderRad,
    fontSize: Constants.headingtwo,
    alignItems: "center",
    width: "60%",
    padding: 12,
    marginTop: 5,
  },

  forgotpass: {
    marginTop: 10,
  },
  bottomtxt: {
    top: 65,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
  },
  signuplnk: {
    fontSize: Constants.headingtwo,
    fontWeight: Constants.Bold,
    color: Constants.primary,
  },
  viewPassword: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.borderRad,
    marginTop: 15,
    padding: 0,
    padding: Constants.paddTwo,
  },
  eyeIcon: {
    marginRight: 15,
  },

  ContinueIcon:{
    
  }
});
