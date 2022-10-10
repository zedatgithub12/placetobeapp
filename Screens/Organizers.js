import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Title, Paragraph } from "react-native-paper";
import Constants from "../constants/Constants";
import EventOrganizer from "../Components/EventOrg";
import OrganizerData from "../src/OrganizerData";

const Organizers = ({navigation})=> {
  const [isorganizer, setOrganizer] = React.useState(true);
 const renderItem=({item})=>{
  <EventOrganizer 
    
  />
 }

  return (
    <View style={styles.container}>
      {isorganizer ? (
        <FlatList
        // List of events in extracted from database in the form JSON data
        // last edited before the light goes off
        data={OrganizerData}
        renderItem={renderItem}
        key={"_"}
        keyExtractor={(item) => item.id}
   
        numColumns={2}
        style={styles.venueFlatlist}
      />
      ) : (
        <View
          style={styles.noOrganizerContainer}
          // a component to be called when there is no event organizer to be listed.
        >
          <Image
            source={require("../assets/organizer.png")}
            style={styles.noOrganizerImage}
            resizeMode="contain"
          />
          <Title style={styles.prompttxt}>There is no organizer added!</Title>
          <Paragraph>It will appear here soon</Paragraph>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.background,
  },
  noOrganizerContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  noOrganizerImage: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  prompttxt: {
    fontSize: Constants.primaryHeading,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
});

export default Organizers;
