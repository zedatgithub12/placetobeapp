import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import Constants from "../constants/Constants";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { HelperText } from "react-native-paper";
import { AuthContext } from "./context";
import Connection from "../constants/connection";


// formone is the first form in add event screen 
// it collect featuredImage, eventName, eventDescription
const FormOne = () => {

  // a useContent hook which will treat all input value as global variables
  // the eventproperties variable is declared inside App mathod bacause we need to keep all gloabal varibales in top tree
  // value collect from input field will be access inside Submit event class found in Screens folder 
  // while submitting event it will validate the value stored in glabal scope

  const { formOne } = React.useContext(AuthContext);
//we call context function inside eventProps function
// we assign the value we collected with eventprops function to the context function  which is -> fromOne
  const eventProps = (image, eventName, eventDesc) => {
    formOne(image, eventName, eventDesc);
    
  };
//state for image picker
  const [hasGalleryPersmission, setHasGalleryPermission] = useState(null);
  var placeholderImage = 'placeholder.png'; // adde event screen featuredImage placeholder
  const placeholder = Connection.url+Connection.assets+placeholderImage; 
  const [image, setImage] = useState(placeholder); //state for image which is displayed when user select image 
  const [imageName, setImageName] = useState(); // state which save the image name which is sent to server and stored inside the database
// event content state
const [inputs, setInputs] = useState({
  eventName: "",
  eventDesc: "",
  fieldBorder: Constants.purple,
  descFieldBorder: Constants.purple,
  helperText: "",
  descHelperText: "",
  checked: false,
  descCheck: false,
  imageBoarder: Constants.purple,
  imageLoader: "notLoading",
});
  // this useeffect hook ask user to grant the app to access Gallery 
   useEffect(() => {
    (async () => {
      const gallerStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(gallerStatus.status === "granted");

    })();
  }, []);

  //we call the following function when user presses the image place holder in add event screen
  const selectFeaturedImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    
// ImagePicker saves the taken photo to disk and returns a local URI to it

let localUri = result.uri; // local image uri 
let filename = localUri.split('/').pop(); // the filename is stored in filename variable

//if the image selection process doesn't cancelled the statement inside the if condition is executed
if (!result.cancelled) {
  setImage(localUri);
  setImageName(filename);
  setInputs({
    ...inputs,
    imageLoader:"loading"
  })
}

// Infer the type of the image
let match = /\.(\w+)$/.exec(filename);
let kind = match ? `image/${match[1]}` : `image`;

// Upload the image using the fetch and FormData APIs
const formData = new FormData();
// Assume "photo" is the name of the form field the server expects
// all image properties needed by server is going to be appended in formdata object
formData.append('photo',{ uri: localUri, name: filename, type:kind });
//the url which the image will be sent to
var ApiUrl = Connection.url + Connection.upload;

return await fetch(ApiUrl, {
  method: 'POST',//request method
  body: formData, // data to be sent to server
  headers: {
    'content-type': 'multipart/form-data', // header type must be 'multipart/form-data' inorder to send image to server
  },
})
.then((response) => response.json()) //check response type of the API
     .then((response) => {
       let message = response[0].message;
      if(message === "successfully uploaded!"){
        setInputs({
          ...inputs,
          imageBoarder: Constants.Success,
          imageLoader: "loaded",
        });

      }
      else {
        setInputs({
          ...inputs,
          imageBoarder: Constants.Danger,
          imageLoader: "loading",
        });
      };
    }
     );
  };

  //function for event title textField
  const nameChange = (text) => {
    if (text.length <= 2) {
      setInputs({
        ...inputs,
        eventName: text,
        fieldBorder: Constants.Danger,
        checked: false,
        helperText: "Make sure event name is more than 3 letters",
      });
    } else if (text.length >= 50) {
      setInputs({
        ...inputs,
        eventName: text,
        fieldBorder: Constants.Danger,
        helperText: "Even name cannot exceed 50 letters",
        checked: false,
      });
    } else if (text.length >= 2 && text.length <= 50) {
      setInputs({
        ...inputs,
        eventName: text,
        fieldBorder: Constants.Success,
        helperText: "",
        checked: true,
      });
    } else {
      setInputs({
        ...inputs,
        eventName: text,
        fieldBorder: Constants.Success,
        helperText: "",
        checked: true,
      });
    }
  };

  // The methods and functions listed below is for event description textInput
  const EventDescription = (desc) => {
    if (desc.length <= 10) {
      setInputs({
        ...inputs,
        eventDesc: desc,
        descFieldBorder: Constants.Danger,
        descHelperText: "Make sure event Description is more than 15 letters",
        descCheck: false,
      });
    } else if(desc.length >= 500){
      setInputs({
        ...inputs,
        eventDesc: desc,
        descFieldBorder: Constants.Danger,
        descHelperText: "Event Description cannot be more than 500 letters",
        descCheck: false,
      })
    }
    else if(desc.length >= 2 && desc.length <= 500){
      setInputs({
        ...inputs,
        eventDesc: desc,
        descFieldBorder: Constants.Success,
        descHelperText: "Describe your event in understandable way!",
        descCheck: true,
      })
    }
  };
  // Event description helper text
 

  // Helper text will be hidden onBlur function event description fielda
  const desHideHelperText = () => {
    setInputs({
      ...inputs,
      descHelperText: "",
    });
    eventProps(imageName, inputs.eventName, inputs.eventDesc);
    
  };

  if (hasGalleryPersmission === false) {
    return <Text> No access to internal Storage</Text>;
  }

  return (
    <View style={styles.formOne}>
      <View style={styles.uploadImageTitleContainer}>
        <Feather name="image" size={24} style={styles.uploadImageIcon} />
        <Text style={styles.uploadImageTxt}>Upload Event Poster</Text>
      </View>
     
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => selectFeaturedImage()}
      >
        <Image
          source={{ uri: image }}
          style={[styles.formOneImage,  {  borderColor: inputs.imageBoarder }]}
          onPress={() => selectFeaturedImage()}
          onBlur={() => desHideHelperText()}
        />
      </TouchableOpacity>
          
       {inputs.imageLoader === "loading" ?
       <View  
       style={styles.activityIndicator}
       >
         <ActivityIndicator size="small" color={Constants.primary}/> 
         <Text style={styles.loadingText}>Loading...</Text>
         </View>
       : inputs.imageLoader === "loaded" ?
       <View  
       style={styles.activityIndicator}
       >
         <MaterialCommunityIcons name="check-circle" size={20} color={Constants.Success}/>
         <Text style={styles.loadingText}>Loaded</Text>
         </View>
      
       : null
       }


      <View
        style={[
          styles.eventTitleContainer,
          { borderColor: inputs.fieldBorder }
        ]}
      >
        <MaterialCommunityIcons
          name="format-title"
          size={24}
          color={Constants.purple}
        />
        <TextInput
          // a text field used accept event title
          placeholder="Enter Event Name"
          numberOfLines={1}
          style={styles.eventTitle}
          value={inputs.eventName}
          onChangeText={(text) => nameChange(text)}
          onBlur={() => desHideHelperText()}

        />
        {
        //check button on validation of input field
        inputs.checked ? (
          <MaterialCommunityIcons
            name="checkbox-marked-circle"
            size={22}
            color={Constants.Success}
            style={styles.checkIcon}
          />
        ) : null}


      </View>
      <HelperText style={{ color: Constants.Danger }}>
        {inputs.helperText}
      </HelperText>


      <View style={[styles.eventDescContainer, {  borderColor: inputs.descFieldBorder}]} >
        <MaterialCommunityIcons
          name="subtitles-outline"
          size={24}
          color={Constants.purple}
          style={{ paddingLeft: 4 }}
        />
        <TextInput
          // a text field used accept event description
          placeholder="Write Your Event Description"
          multiline
          numberOfLines={2}
          style={styles.eventDescription}
          value={inputs.eventDesc}
          onChangeText={(desc) => EventDescription(desc)}
          onBlur={() => desHideHelperText()}
        />
          {
        //check button on validation of input field
        inputs.descCheck ? (
          <MaterialCommunityIcons
            name="checkbox-marked-circle"
            size={22}
            color={Constants.Success}
            style={styles.checkIcon}
          />
        ) : null}
      </View>
      <HelperText style={{ color: Constants.Danger }}>
        {inputs.descHelperText}
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  formOne: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:10,
  },
  uploadImageTitleContainer: {
    width: "90%",
    flexDirection: "row",
    padding: 8,
  },
  uploadImageIcon: {
    color: Constants.purple,
  },
  uploadImageTxt: {
    marginLeft: 10,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingone,
    color: Constants.Inverse,
    marginBottom: 10,
  },
  formOneImage: {
    height: 230,
    width: 230,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor:Constants.Faded,
    borderWidth: 0.4,
  },
  ImageButtons: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  imageUploadbtn: {
    width: "40%",
    backgroundColor: Constants.primary,
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },

  btnTxt: {
    fontSize: Constants.headingtwo,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.Inverse,
  },
  eventContentContainer: {
    width: "90%",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 10,
  },
  eventTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.mediumbox,
    paddingLeft: 10,
    marginTop: 20,
    borderWidth: 1,
  },
  eventTitle: {
    width: "81%",
    alignSelf: "flex-start",
    marginLeft: 5,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 35,
    borderColor: Constants.Secondary,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
 
    
  },
  eventDescContainer: {
    width: "90%",
    backgroundColor: Constants.Faded,
    borderRadius: Constants.mediumbox,
    padding: 8,
    borderWidth: 1,
    
  },
  eventDescription: {
    width: "90%",
    maxHeight:85,
    alignSelf: "flex-start",
    paddingLeft: 10,
    padding: 2,
    borderColor: Constants.Secondary,
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    fontSize: Constants.headingtwo,
    color: Constants.Inverse,
 
    
  },
  checkIcon: {
    position:"absolute",
    top:10,
    right:2,
    paddingRight:4,
  },
  activityIndicator:{
    flexDirection:"row",
    padding:5,
  },
  loadingText:{
    marginLeft:6,
    color: Constants.Inverse,
  }
});

export default FormOne;
