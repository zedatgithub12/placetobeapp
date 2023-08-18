import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Typography } from "../../../themes/typography";
import Connection from "../../../api";
import galleryImage from "../../../assets/images/galleryImage.png";

const Rating = ({
  visible,
  onClose,
  currentRating,
  previousReview,
  onSubmitFeedback,
  event,
  user,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(visible);
  const [review, setReview] = useState("");
  var featuredImageUri = Connection.url + Connection.assets;

  const handleSubmitReview = () => {
    onSubmitFeedback(currentRating, review);
    setModalVisible(false);
    onClose();
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    onClose();
  };

  useEffect(() => {
    setReview(previousReview);
    return () => {};
  }, []);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={{ flex: 1 }}>
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
            <TouchableOpacity onPress={handleCloseModal} style={{ padding: 6 }}>
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

            <TouchableOpacity
              onPress={handleSubmitReview}
              style={{
                borderRadius: 5,
                paddingHorizontal: 12,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: Typography.family,
                  fontSize: Typography.size.headingtwo,
                  fontWeight: Typography.weight.bold,
                  color: theme.dark.main,
                }}
              >
                Post
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
            {user.profile ? (
              <Image
                //Featured Image of the event
                source={{
                  uri: featuredImageUri + user.profile,
                }} //featured image source
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginTop: 3,
                }}
              />
            ) : (
              <Image
                source={galleryImage}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginTop: 3,
                }}
                resizeMode="contain"
              />
            )}

            <View style={{ marginLeft: 4 }}>
              {user.first_name && user.middle_name && (
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
                  {user.first_name + " " + user.middle_name}
                </Text>
              )}

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
      </View>
    </Modal>
  );
};

export default Rating;
