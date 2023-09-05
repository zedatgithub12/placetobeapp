import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  LogBox,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { showToast } from "../../Utils/Toast";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import { AuthContext } from "../../Components/context";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Caption } from "react-native-paper";

import Constants from "../../constants/Constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Connection from "../../api";
import getUserDeviceToken from "../../Utils/getUserDeviceToken";

WebBrowser.maybeCompleteAuthSession();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function Signin({ navigation }) {
  // login userInput
  const { SignIn, GoogleAuth } = React.useContext(AuthContext);

  const loginState = (userId, userToken, userEmail, password, profile) => {
    SignIn(userId, userToken, userEmail, password, profile);
  };
  const [loading, setLoading] = useState(false);
  const [googleLoader, setGoogleLoader] = useState(false);

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

  const retrieveToken = async () => {
    const token = await getUserDeviceToken();
    return token;
  };

  const ManualSignin = async () => {
    var Email = data.email;
    var password = data.password;
    const token = await retrieveToken();

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
        email: Email,
        password: password,
        device_token: token,
      };
      fetch(InserAPIURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            var userId = JSON.stringify(response.data.id);
            var userToken = response.data.device_token;
            var userEmail = response.data.email;
            var profile = response.data.profile;
            var username = response.data.username;
            var First_Name = response.data.First_Name;
            var Middle_Name = response.data.Middle_Name;
            var lastName = response.data.lastName;
            var gender = response.data.gender;
            var category = response.data.category;
            var phone = response.data.phone;
            var status = response.data.status;

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
              email_error: response.message,
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

  const googleSignUp = (id, token, email, googleId, profile) => {
    GoogleAuth(id, token, email, googleId, profile);
  };

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { user } = await GoogleSignin.signIn();
      const d_token = await retrieveToken();
      setGoogleLoader(true);

      // You can now use the userInfo object to authenticate the user in your backend
      var ApiUrl = Connection.url + Connection.googleSignUp;
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      var Data = {
        id: user.id,
        email: user.email,
        name: user.name,
        fatherName: user.familyName,
        kidName: user.givenName,
        device_token: d_token,
      };

      fetch(ApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json()) //check response type of the API
        .then((response) => {
          if (response.success) {
            var user = response.data;
            var userid = JSON.stringify(user.id);
            googleSignUp(
              userid,
              user.device_token,
              user.email,
              user.google_Id,
              user.profile
            );
            setGoogleLoader(false);
            navigation.navigate("TabNav");
          } else {
            setData({
              ...data,
              check_textInputChange: false,
              isFieldEmpty: false,
              emptyField: response.message,
            });
            setGoogleLoader(false);
          }
        })
        .catch((error) => {
          setGoogleLoader(false);
          showToast("Error continuing with Google");
        });
    } catch (error) {
      if (error.code === statusCodes.IN_PROGRESS) {
        showToast("Signin in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showToast("Play Services Not Available or Outdated");
      } else {
        showToast("Some error occurred");
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "903368065253-g8k9n3vv8594b7erho9rem4ajqbu9um6.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    });
  }, []);

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
          onPress={() => ManualSignin()}
          style={styles.signinbtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Constants.Inverse} />
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
          onPress={() => handleSignIn()}
        >
          <Image
            source={require("../../assets/images/google.png")}
            style={{ width: 25, height: 25 }}
          />
          {googleLoader ? (
            <ActivityIndicator size="small" color={Constants.Inverse} />
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
          <ActivityIndicator size="small" color={Constants.Inverse} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("ForgotPass")}
        style={{ marginTop: 4 }}
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
    left: 0,
    top: 30,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    height: 40,
    width: 40,
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
