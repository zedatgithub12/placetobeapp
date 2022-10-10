//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import Constants from "../constants/Constants";

// create a component
const Faq = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  return (
    <List.Section>
      <List.Accordion
        title="SignIn and Sign Up"
        description="Item description"
        left={(props) => <List.Icon {...props} icon="folder" />}
      >
        <List.Item
         title="First item"
         titleStyle={styles.titleStyles} 
        descriptionNumberOfLines={10}
         description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum, ipsum et lobortis aliquet, arcu purus sagittis neque, et molestie mauris nulla eget lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean a enim quis ex luctus facilisis in eu magna. Vivamus sed nibh aliquam, ultricies risus et, pulvinar tortor. In ullamcorper iaculis tincidunt. Ut viverra tellus nec felis volutpat, eget molestie ex luctus. Integer interdum metus sed eros malesuada placerat. Curabitur eget ullamcorper magna, eu imperdiet mi. Etiam sit amet ultricies velit. Sed vel enim ligula. Donec fermentum lorem ac orci consectetur, nec pellentesque tortor fringilla. " />
        <List.Item title="Second item" />
      </List.Accordion>

      <List.Accordion
        title="Controlled Accordion"
        description="Item description"
        left={(props) => <List.Icon {...props} icon="folder" />}
        expanded={expanded}
        onPress={handlePress}
      >
        <List.Item title="First item" />
        <List.Item title="Second item" />
      </List.Accordion>
    </List.Section>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  titleStyles:{
      color:Constants.Secondary
  }
});

//make this component available to the app
export default Faq;
