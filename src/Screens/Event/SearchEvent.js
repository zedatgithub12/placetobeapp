import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";

import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Caption, Paragraph, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Fontisto,
} from "react-native-vector-icons";
import Constants from "../../constants/Constants";
import Events from "../../Components/Events/Events";
import Connection from "../../constants/connection";
import Listing from "../../Components/Events/Skeleton/ListShimmer";
import { useTheme } from "@react-navigation/native";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
import { Typography } from "../../themes/typography";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CategoryColor,
  EntranceFee,
  DateFormater,
  TimeFormater,
  formatNumber,
} from "../../Utils/functions";
import P2bMenu from "../../ui-components/menu";
import { EventType } from "../../data/eventType";
import { EventCategory } from "../../data/eventCategory";
import Loader from "../../ui-components/ActivityIndicator";

const SearchEvent = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchInput, setSearchInput] = useState("");
  const [inputs, setInputs] = useState({
    submitBtn: false,
    startDateBorder: Constants.Inverse,
    startDateCheckIcon: false,

    endDateBorder: Constants.Inverse,
    endDateCheckIcon: false,
  });

  const [search, setSearch] = useState([]);
  const [filteredEvent, setFilteredEvent] = useState([]);

  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [endingDate, setEndingDate] = useState(new Date());
  const [endMode, setEndMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showit, setShowit] = useState(false);
  const [startDate, setStartDate] = useState("Start Date");
  const [endDate, setEndDate] = useState("End Date");

  const [open, setOpen] = useState(false);
  const [openCategoryMenu, setCategoryMenu] = useState(false);
  const [selectedType, setSelected] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [category, setCategory] = useState("All");

  /************************************************** */
  // when user enter keys inside search box this function will be triggered
  /******************************************************** */
  const updateSearchKey = (text) => {
    setSearchInput(text);
    if (text.length <= 0) {
      setInputs({
        ...inputs.submitBtn,
        submitBtn: false,
      });
    } else {
      setInputs({
        ...inputs.submitBtn,
        submitBtn: true,
      });
    }
  };
  // clear text entered in search Field
  const ClearInputs = () => {
    setSearchInput("");
    setInputs({
      ...inputs.submitBtn,
      submitBtn: false,
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  //rendered event list
  const renderedItem = ({ item }) => (
    <Events
      Event_Id={item.id}
      org_id={item.userId}
      FeaturedImage={item.event_image}
      title={item.event_name}
      date={DateFormater(item.start_date)}
      time={TimeFormater(item.start_time)}
      venue={item.event_address}
      category={CategoryColor(item.category)}
      Price={EntranceFee(item.event_entrance_fee)}
      onPress={() => navigation.navigate("EventDetail", { id: item.id })}
    />
  );

  // rendering empty flatlist
  const listEmptyComponent = () => (
    <View style={styles.searchSuggestion}>
      <Ionicons
        name="search-outline"
        size={40}
        color={Constants.primary}
        style={styles.submitIcon}
      />
      <Title style={styles.prompttxt}>No result found</Title>
      <Paragraph>Your search result appear here.</Paragraph>
    </View>
  );

  // a code to select event start Date and time
  const onChange = (event, SelectDate) => {
    const currentDate = SelectDate || Date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let startDate =
      tempDate.getFullYear() +
      "-" +
      (tempDate.getMonth() + 1) +
      "-" +
      tempDate.getDate();

    setStartDate(startDate);
  };

  // code written below is to select event end date and end a time
  const onChangeEndDate = (event, SelectedEndDate) => {
    const eventEndDate = SelectedEndDate || Date;

    setShowit(Platform.OS === "ios");
    setEndingDate(eventEndDate);

    let expiredDate = new Date(eventEndDate);

    let endDate =
      expiredDate.getFullYear() +
      "-" +
      (expiredDate.getMonth() + 1) +
      "-" +
      expiredDate.getDate();

    setEndDate(endDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const endDateShowMode = (eventEndDate) => {
    setShowit(true);
    setEndMode(eventEndDate);
  };

  const handleResetFiltering = () => {
    setStartDate("Start Date");
    setEndDate("End Date");
    setSelected("All");
    setCategory("All");
    setPriceRange([0, 2000]);
  };

  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
  };

  const SubmitQuery = () => {
    setLoading(true);
    setSearching(true);

    const controller = new AbortController();
    const signal = controller.signal;

    var ApiUrl = Connection.url + Connection.search + `?query=${searchInput}`;

    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(ApiUrl, {
      method: "GET",
      headers: headers,
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setFilteredEvent(response.data);
          setLoading(false);
          setSearching(false);
        } else {
          setLoading(false);
          setSearching(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setSearching(false);
      });
    return () => {
      // cancel the subscription

      controller.abort();
    };
  };

  useEffect(() => {
    const searchEvent = () => {
      setLoading(true);
      setSearching(true);

      const controller = new AbortController();
      const signal = controller.signal;

      var ApiUrl = Connection.url + Connection.search + `?query=${searchInput}`;

      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      fetch(ApiUrl, {
        method: "GET",
        headers: headers,
        signal: signal,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            setSearch(response.data);
            setFilteredEvent(response.data);
            setLoading(false);
            setSearching(false);
          } else {
            setLoading(false);
            setSearching(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          setSearching(false);
        });

      return () => {
        // cancel the subscription

        controller.abort();
      };
    };
    searchEvent();
    return () => {};
  }, []);

  useEffect(() => {
    const filteredData = search.filter((event) => {
      let isMatch = true;

      if (searchInput !== "") {
        const searchRegex = new RegExp(searchInput, "i");
        isMatch =
          isMatch &&
          (searchRegex.test(event.event_name) ||
            searchRegex.test(event.event_address) ||
            searchRegex.test(event.event_organizer));
      }

      if (startDate !== "Start Date") {
        isMatch = isMatch && event.start_date >= startDate;
      }
      if (endDate !== "End Date") {
        isMatch = isMatch && event.end_date <= endDate;
      }
      if (selectedType !== "All") {
        isMatch = isMatch && event.event_type === selectedType;
      }
      if (category !== "All") {
        isMatch = isMatch && event.category === category;
      }
      if (priceRange !== [0, 2000]) {
        isMatch =
          isMatch &&
          event.event_entrance_fee >= priceRange[0] &&
          event.event_entrance_fee <= priceRange[1];
      }
      return isMatch;
    });
    setFilteredEvent(filteredData);
    return () => {};
  }, [searchInput, startDate, endDate, selectedType, category, priceRange]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.darker }}>
      <View
        // search and filter container
        style={[styles.headers, { width: Dimensions.get("screen").width }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <AntDesign
            name="arrowleft"
            size={20}
            color={Constants.Inverse}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View
          style={styles.SearchFieldContainer}
          //search icon and text field container
        >
          <TextInput
            //a text input which enables user to search for specific data they are looking for
            placeholder="Search..."
            style={styles.SearchField}
            value={searchInput}
            onChangeText={(text) => updateSearchKey(text)}
            onSubmitEditing={() => SubmitQuery()}
          />
          {inputs.submitBtn && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => ClearInputs()}
            >
              <AntDesign name="close" size={16} color={Constants.Inverse} />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: "22.5%",
          }}
        >
          <TouchableOpacity
            //filter button container
            activeOpacity={0.8}
            style={styles.submitSearch}
            onPress={() => SubmitQuery()}
          >
            <Ionicons
              name="search-outline"
              size={22}
              style={styles.submitIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            //filter button container
            activeOpacity={0.8}
            style={styles.submitSearch}
            onPress={() => toggleModal()}
          >
            <Fontisto name="equalizer" size={16} style={styles.submitIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View>
          <Loader size="small" />
        </View>
      ) : (
        <FlatList
          // List of events in extracted from database in the form JSON data
          data={filteredEvent}
          renderItem={renderedItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => listEmptyComponent()}
          style={styles.filteredEventList}
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.bottomsheetcontainer}
      >
        <Animatable.View
          animation="slideInUp"
          duration={0.5}
          style={[
            styles.bottomsheet,
            {
              minHeight:
                selectedType === "paid"
                  ? Dimensions.get("screen").height / 1.7
                  : Dimensions.get("screen").height / 2.1,
            },
          ]}
        >
          <View style={styles.sheetHeader}>
            <Text
              style={{
                fontSize: Typography.size.primaryHeading,
                fontWeight: Typography.weight.bold,
              }}
            >
              Filter Events
            </Text>

            <TouchableOpacity style={styles.closebtn} onPress={toggleModal}>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={Constants.Inverse}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Caption>Start Date</Caption>
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => showMode("date")}
                  style={[styles.eventContentContainer, { borderWidth: 0.5 }]}
                >
                  <Text style={styles.selectDateTxt}> {startDate}</Text>
                  <Fontisto name="date" size={16} color={theme.primary[600]} />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Caption>End Date</Caption>
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => endDateShowMode("date")}
                  style={[styles.eventContentContainer, { borderWidth: 0.5 }]}
                >
                  <Text style={styles.selectDateTxt}> {endDate}</Text>
                  <Fontisto name="date" size={16} color={theme.primary[600]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View>
              <Caption>Event Type</Caption>
              <P2bMenu
                value={selectedType}
                open={open}
                FirstChild={
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setOpen(!open)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 10,
                    }}
                  >
                    <Text style={{ textTransform: "capitalize" }}>
                      {selectedType}
                    </Text>

                    {open ? (
                      <MaterialCommunityIcons name="chevron-up" size={20} />
                    ) : (
                      <MaterialCommunityIcons name="chevron-down" size={20} />
                    )}
                  </TouchableOpacity>
                }
              >
                <View>
                  {EventType.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setOpen(false), setSelected(type.title);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Typography.family,
                          fontSize: Typography.size.headingthree,
                          fontWeight: Typography.weight.medium,
                          paddingVertical: 7,
                          paddingHorizontal: 8,
                          textTransform: "capitalize",
                        }}
                      >
                        {type.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </P2bMenu>
            </View>

            <View>
              <Caption>Category</Caption>
              <P2bMenu
                value={selectedType}
                open={openCategoryMenu}
                FirstChild={
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setCategoryMenu(!openCategoryMenu)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 10,
                    }}
                  >
                    <Text style={{ textTransform: "capitalize" }}>
                      {category}
                    </Text>
                    {openCategoryMenu ? (
                      <MaterialCommunityIcons name="chevron-up" size={20} />
                    ) : (
                      <MaterialCommunityIcons name="chevron-down" size={20} />
                    )}
                  </TouchableOpacity>
                }
              >
                {EventCategory.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCategoryMenu(false), setCategory(type.name);
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Typography.family,
                        fontSize: Typography.size.headingthree,
                        fontWeight: Typography.weight.medium,
                        paddingVertical: 7,
                        paddingHorizontal: 8,
                      }}
                    >
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </P2bMenu>
            </View>
          </View>

          {selectedType === "paid" && (
            <View
              style={{
                alignSelf: "center",
                marginBottom: 10,
                marginTop: 20,
              }}
            >
              <Caption>Entrance Fee Range</Caption>
              <View>
                <Text
                  style={{
                    fontSize: Constants.headingtwo,
                    fontWeight: Constants.Boldtwo,

                    color: Constants.textColor,
                  }}
                >
                  {formatNumber(priceRange[0])} - {formatNumber(priceRange[1])}{" "}
                  ETB
                </Text>
                <MultiSlider
                  style={{}}
                  trackStyle={{
                    backgroundColor: theme.dark[100], // Change the background color of the track
                    height: 6,
                    borderRadius: 8,
                  }}
                  selectedStyle={{
                    backgroundColor: theme.primary.main, // Change the background color of the selected area
                    height: 6,
                  }}
                  markerStyle={{
                    backgroundColor: theme.primary[600], // Change the background color of the markers
                    width: 16,
                    height: 16,
                    marginTop: 4,
                  }}
                  values={priceRange}
                  min={0}
                  max={5000}
                  step={1}
                  sliderLength={Dimensions.get("screen").width / 1.2}
                  onValuesChange={handlePriceRangeChange}
                />
              </View>
            </View>
          )}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "center",
              position: "absolute",
              bottom: selectedType === "Paid" ? 30 : 50,
              width: "98%",
              zIndex: 1,
              overflow: "visible",
            }}
          >
            <TouchableNativeFeedback onPress={() => handleResetFiltering()}>
              <View
                style={{
                  backgroundColor: theme.dark[100],
                  padding: 12,
                  paddingHorizontal: 40,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: Constants.headingtwo,
                    fontWeight: Constants.Boldtwo,
                    textAlign: "center",
                    color: Constants.textColor,
                  }}
                >
                  Reset
                </Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={toggleModal}>
              <View
                style={{
                  backgroundColor: theme.primary.main,
                  padding: 12,
                  paddingHorizontal: 70,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: Constants.headingtwo,
                    fontWeight: Constants.Boldtwo,
                    textAlign: "center",
                    color: Constants.textColor,
                  }}
                >
                  Done
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="spinner"
              collapsable={true}
              onChange={onChange}
              maximumDate={new Date(2050, 12, 31)}
              minimumDate={new Date(2000, 0, 1)}
            />
          )}
          {showit && (
            <DateTimePicker
              testID="endDateTimePicker"
              value={endingDate}
              mode={endMode}
              is24Hour={true}
              display="spinner"
              onChange={onChangeEndDate}
              maximumDate={new Date(2050, 12, 31)}
              minimumDate={new Date(2000, 0, 1)}
            />
          )}
        </Animatable.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.background,
  },
  // search and filter container
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingVertical: Constants.paddTwo,
    paddingHorizontal: 6,
  },
  SearchFieldContainer: {
    flexDirection: "row",
    position: "relative",
    minWidth: "54%",
    backgroundColor: Constants.background,
    borderRadius: 50,
    padding: 6,
    paddingLeft: 10,
    elevation: 1,
    shadowColor: Constants.Faded,
  },
  backArrow: {
    borderRadius: Constants.mediumbox,
    borderRadius: 20,
    padding: 4,
  },
  backIcon: {
    borderRadius: 20,
    padding: 4,
  },
  SearchField: {
    marginLeft: 10,
    minWidth: "50%",
  },
  submitSearch: {
    backgroundColor: Constants.Inverse,
    color: Constants.background,
    borderRadius: 10,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    width: 38,
  },
  submitIcon: {
    color: Constants.primary,
  },
  categoryList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    padding: 5,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: Constants.borderRad,
    shadowColor: Constants.background,
  },
  clearButton: {
    padding: 5,
  },
  //Category name
  catName: {
    fontFamily: Constants.fontFam,
    fontWeight: Constants.Bold,
    color: Constants.background,
  },
  //category flatlist styling
  catFlatlist: {
    position: "relative",
  },
  filteredEventList: {},

  noResultContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  searchSuggestion: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "17%",
  },
  noResultImage: {
    width: "85%",
    height: 200,
    borderRadius: 10,
  },
  prompttxt: {
    fontSize: Constants.headingone,
    fontWeight: Constants.Bold,
    marginTop: 10,
  },
  bottomsheetcontainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomsheet: {
    backgroundColor: Constants.Faded,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopLeftRadius: 14,
    borderTopEndRadius: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 4,
    marginBottom: 18,
  },
  closebtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 18,
  },
  eventContentContainer: {
    width: Dimensions.get("screen").width / 1 / 2.4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginLeft: 0,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 0.3,
  },
});

export default SearchEvent;
