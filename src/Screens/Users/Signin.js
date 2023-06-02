import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  LogBox,
  ScrollView,
} from "react-native";
import Constants from "../../constants/Constants";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import { AuthContext } from "../../Components/context";
import Connection from "../../constants/connection";
import { ActivityIndicator, Caption } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function Signin({ navigation }) {
  // login userInput
  const { SignIn } = React.useContext(AuthContext);
  const loginState = (userId, userToken, userEmail, password, profile) => {
    SignIn(userId, userToken, userEmail, password, profile);
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

  const googleSignUp = (id, token, email, googleId, profile) => {
    GoogleSignIn(id, token, email, googleId, profile);
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

          if (resp.message === "succeed") {
            var userInfo = response[0].user[0];
            googleSignUp(
              userInfo.userId,
              userInfo.authentication_key,
              userInfo.email,
              userInfo.google_Id,
              userInfo.profile
            );
            navigation.navigate("TabNav");
          } else if (resp.message === "successfully Registered") {
            var userInfo = response[0].user[0];
            googleSignUp(
              userInfo.userId,
              userInfo.authentication_key,
              userInfo.email,
              userInfo.google_Id,
              userInfo.profile
            );
            navigation.navigate("TabNav");
          } else {
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
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backArrow} // back arrow button style
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-sharp"
          size={25}
          //back arrow icon
          color={Constants.Inverse}
        />
      </TouchableOpacity>
      <Image
        style={styles.loginimage}
        source={require("../../assets/images/logo.png")}
      />

      <Caption style={styles.subTitle}>Sign in with your email address</Caption>

      {data.isValidEmail ? null : (
        <View style={styles.error_Message}>
          <Text style={styles.errorTxt}>{data.email_error}</Text>
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
          onChangeText={(val) => textInputChange(val)}
        />
      </View>

      <View style={styles.viewPassword}>
        <MaterialIcons name="security" size={24} color={Constants.primary} />

        <TextInput
          style={styles.password}
          placeholder="Password"
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
              color={Constants.purple}
              style={styles.showpassword}
            />
          ) : (
            <Ionicons
              name="eye-outline"
              size={22}
              color={Constants.purple}
              style={styles.showpassword}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
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
            source={require("../../assets/images/google.png")}
            style={{ width: 25, height: 25 }}
          />
          {googleLoader ? (
            <ActivityIndicator size="small" color={Constants.primary} />
          ) : (
            <Text style={styles.signbtntxt}>Continue With Google</Text>
          )}

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
        onPress={() => navigation.navigate("ForgotPass")}
      >
        <Text style={styles.forgotpass}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.bottomtxt}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signuplnk}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: Constants.background,
    alignItems: "center",
    paddingBottom: "40%",
    paddingTop: 40,
  },
  backArrow: {
    position: "absolute",
    left: 5,
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
    marginTop: "17%",
  },
  title: {
    fontFamily: Constants.fontFam,
    fontSize: Constants.headingone,
    color: Constants.primary,
    fontWeight: Constants.Bold,
    marginTop: -30,
  },
  emailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 10,
    backgroundColor: Constants.Faded,
    borderRadius: Constants.medium,
    paddingLeft: 6,
    borderWidth: 0.5,
    borderColor: Constants.primary,
  },

  emailAddress: {
    padding: Constants.paddTwo,
    fontSize: Constants.headingtwo,
    paddingLeft: 10,

    width: "90%",
  },
  error_Message: {
    marginTop: 10,
    flexDirection: "row",
  },
  errorTxt: {
    color: Constants.red,
  },
  subTitle: {
    color: Constants.Secondary,
  },
  viewPassword: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 15,
    backgroundColor: Constants.Faded,
    borderRadius: Constants.medium,
    paddingLeft: 6,
    borderWidth: 0.5,
    borderColor: Constants.primary,
  },
  password: {
    padding: Constants.paddTwo,
    fontSize: Constants.headingtwo,
    paddingLeft: 10,
    width: "78%",
  },
  showpassword: {
    paddingRight: 12,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    margin: 10,
  },

  signinbtn: {
    backgroundColor: Constants.primary,
    borderRadius: Constants.tiny,
    fontSize: Constants.headingtwo,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
    minWidth: 100,
    width: "100%",
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
    borderRadius: Constants.tiny,
    fontSize: Constants.headingtwo,
    alignItems: "center",
    width: "80%",
    padding: 10,
    marginTop: 5,
    elevation: 4,
    shadowColor: Constants.Secondary,
  },

  forgotpass: {
    marginTop: 10,
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
});
