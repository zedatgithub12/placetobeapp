<View style={styles.homeSection2}>
  <ScrollView contentContainerStyle={{ minHeight: 40 }}>
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.categories}
        showsHorizontalScrollIndicator={false}
      >
        {Category.map((item, index) => (
          <Categories
            key={index}
            icon={item.icon}
            category={item.name}
            border={item.color}
            background={
              active === item.name ? item.color : theme.background.main
            }
            color={
              active === item.name ? Constants.background : Constants.Inverse
            }
            onPress={() => handleCategoryClick(item.name, item.type)}
          />
        ))}
      </ScrollView>
    </View>
  </ScrollView>
</View>;

/****************************************
 * Render events those the category is "All"
 */
const renderAll = () => {
  const featured_event = events.filter((event) => event.priority === 1);
  setFeatured(featured_event);

  const happening_event = events.filter(
    (event) => event.start_date <= today && event.end_date >= today
  );
  setHappening(happening_event);

  const upcoming_event = events.filter(
    (event) => event.start_date <= today && event.end_date >= today
  );
  setUpcoming(upcoming_event);
};

const weekEvents = () => {
  const this_weekevents = events.filter((event) => {
    const currentDate = new Date();
    // Get the start and end dates of the week
    const startOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    const endOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (6 - currentDate.getDay())
    );
    // Convert the event's start and end dates to Date objects
    const eventStartDate = new Date(formattedDate(event.start_date));
    const eventEndDate = new Date(formattedDate(event.end_date));

    // Check if the event's start date is within the current week
    const isStartDateValid =
      eventStartDate >= startOfWeek && eventStartDate <= endOfWeek;

    // Check if the event's end date is within the current week
    const isEndDateValid =
      eventEndDate >= startOfWeek && eventEndDate <= endOfWeek;

    // Return true only if all conditions are met
    return isStartDateValid && isEndDateValid;
  });

  setThisWeek(this_weekevents);
};

const upcomingEvents = () => {
  const upcomings = events.filter((event) => {
    const currentDate = new Date();

    const endOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (6 - currentDate.getDay())
    );
    // Convert the event's start and end dates to Date objects
    const eventStartDate = new Date(formattedDate(event.start_date));

    // Check if the event's start date is after the end of the current week
    const isStartDateValid = eventStartDate > endOfWeek;

    // Return true only if all conditions are met
    return isStartDateValid;
  });

  setUpcoming(upcomings);
};
