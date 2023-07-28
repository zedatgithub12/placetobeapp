import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import NotLoggedIn from "../../../handlers/auth";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Typography } from "../../../themes/typography";
import { showToast } from "../../../Utils/Toast";

const Rating = ({
  visible,
  onClose,
  currentRating,
  onSubmitFeedback,
  event,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(visible);
  const [review, setReview] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSubmitReview = () => {
    // Handle the submission of the review here
    console.log("Rating:", currentRating);
    console.log("Review:", review);
    onSubmitFeedback(currentRating, review);
    setModalVisible(false);
    onClose();
    showToast("Successfully Rated!");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={{ flex: 1 }}>
        {isLoggedIn ? (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 12,
              }}
            >
              <TouchableOpacity
                onPress={handleSubmitReview}
                style={{ padding: 6 }}
              >
                <AntDesign name="close" size={18} color={theme.dark.main} />
              </TouchableOpacity>

              <Text
                style={{
                  fontFamily: Typography.family,
                  fontSize: 18,
                  fontWeight: Typography.weight.bold,
                  color: theme.dark[800],
                  width: Dimensions.get("screen").width / 1.65,
                }}
              >
                {event.event_name}
              </Text>

              <TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Typography.family,
                    fontSize: 14,
                    fontWeight: Typography.weight.bold,
                    color: theme.buttons.main,
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: Dimensions.get("screen").width / 1.2,
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 20,
                marginRight: 10,
              }}
            >
              <Image
                //Featured Image of the event
                source={{
                  uri: "https://source.unsplash.com/collection/3824775/1600x900",
                }} //featured image source
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginTop: 3,
                }}
              />
              <View style={{ marginLeft: 4 }}>
                <Text
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: Typography.family,
                    fontSize: Typography.size.headingone,
                    fontWeight: Typography.weight.bold,
                    color: theme.dark.main,
                    paddingLeft: 10,
                  }}
                >
                  ZERIHUN
                </Text>
                <Text
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    fontFamily: Typography.family,
                    fontWeight: Typography.weight.regular,
                    lineHeight: 20,
                    color: theme.dark[400],
                    marginTop: 2,
                  }}
                >
                  Reviews are public and includes your account and device info
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 9,
                paddingHorizontal: 10,
                width: Dimensions.get("screen").width / 2,
                justifyContent: "space-between",
              }}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <AntDesign
                  key={value}
                  name={currentRating >= value ? "star" : "staro"}
                  size={28}
                  color={theme.primary.main}
                />
              ))}
            </View>

            <TextInput
              style={{
                margin: 10,
                marginTop: 16,
                padding: 8,
                borderColor: theme.dark.main,
                borderWidth: 0.4,
                borderRadius: 4,
                fontFamily: Typography.family,
              }}
              placeholder="Descripe your experience (optional)"
              onChangeText={(text) => setReview(text)}
              value={review}
              multiline
            />
          </View>
        ) : (
          <NotLoggedIn
            helpertext="To post event on Place to be Ethiopia you must have a user account."
            signUp={() => navigation.navigate("SignUp")}
            signIn={() => navigation.navigate("SignIn")}
          />
        )}
      </View>
    </Modal>
  );
};

export default Rating;
