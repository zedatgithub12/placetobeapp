import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NotLoggedIn from "../../../handlers/auth";

const Rating = ({
  visible,
  onClose,
  currentRating,
  onSubmitFeedback,
 
  navigation,
}) => {
  const [rating, setRating] = useState(currentRating);
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
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        {isLoggedIn ? (
          <View>
            <View style={{ flexDirection: "row" }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRating(value)}
                >
                  <Ionicons
                    name={currentRating >= value ? "star" : "star-outline"}
                    size={24}
                    color={currentRating >= value ? "gold" : "gray"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={{
                height: 100,
                marginVertical: 10,
                borderColor: "gray",
                borderWidth: 1,
              }}
              placeholder="Write your review..."
              onChangeText={(text) => setReview(text)}
              value={review}
              multiline
            />
            <Button title="Submit" onPress={handleSubmitReview} />
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
