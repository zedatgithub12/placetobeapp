import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Card, Avatar, Title, Paragraph } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons';
import Constants from "../constants/Constants";

const EventOrganizer = ({...props}) => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Cover source={require("../assets/orgBack.jpg")} />
        <Card.Content>
          <Title>{props.name}</Title>
          <Paragraph>Card content</Paragraph>
        </Card.Content>

      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default EventOrganizer;
