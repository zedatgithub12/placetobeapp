export const ArrivalTime = () => {
  const d = new Date();
  let hour = d.getHours();
  let minute = d.getMinutes();
  var time;
  if (hour > 12) {
    time = hour - 12 + ":" + minute + " pm";
  } else if (hour == 12) {
    time = hour + ":" + minute + " pm";
  } else {
    time = hour + ":" + minute + " am";
  }

  return time;
};

/********************************************************** */
//date function which perform date format conversion and return the suitable format for frontend
/********************************************************** */

export const DateFormater = (startingDate) => {
  var date = new Date(startingDate);
  let day = date.getDay();
  let month = date.getMonth();
  let happeningDay = date.getDate();

  // return weekname
  var weekday = new Array(7);
  weekday[1] = "Mon, ";
  weekday[2] = "Tue, ";
  weekday[3] = "Wed, ";
  weekday[4] = "Thu, ";
  weekday[5] = "Fri, ";
  weekday[6] = "Sat, ";
  weekday[0] = "Sun, ";

  //an array of month name
  var monthName = new Array(12);
  monthName[1] = "Jan";
  monthName[2] = "Feb";
  monthName[3] = "Mar";
  monthName[4] = "Apr";
  monthName[5] = "May";
  monthName[6] = "Jun";
  monthName[7] = "Jul";
  monthName[8] = "Aug";
  monthName[9] = "Sep";
  monthName[10] = "Oct";
  monthName[11] = "Nov";
  monthName[12] = "Dec";

  return weekday[day] + monthName[month + 1] + " " + happeningDay;
};
export const TimeFormater = (eventTime) => {
  var time = eventTime;
  var result = time.slice(0, 2);
  var minute = time.slice(3, 5);
  var globalTime;
  var postMeridian;
  var separator = ":";
  if (result > 12) {
    postMeridian = result - 12;
    globalTime = "PM";
  } else {
    postMeridian = result;
    globalTime = "AM";
  }

  return postMeridian + separator + minute + " " + globalTime;
};
export const EntranceFee = (price) => {
  var eventPrice;
  var free = "Free";
  var currency = " ETB";
  if (price != 0) {
    eventPrice = price + currency;
  } else {
    eventPrice = free;
  }
  return eventPrice;
};
// events category color
export const CategoryColor = (category) => {
  var color;
  switch (category) {
    case "Entertainment":
      color = "#007bc2";
      break;
    case "Travelling":
      color = "#0c790c";
      break;

    case "Cinema & Theater":
      color = "#00e8e0";
      break;

    case "Community":
      color = "#F96666";
      break;
    case "Trade Fairs & Expo":
      color = "#f57a00";
      break;
    case "Nightlife":
      color = "#472D2D";
      break;
    case "Professional":
      color = "#2c2e27";
      break;
    case "Shopping":
      color = "#9306c2";
      break;
    case "Sport":
      color = "#ff0571";
      break;
    case "Others":
      color = "#e8b200";
      break;
    default:
      color = "#ffbb00";
  }
  return color;
};

// check if there is discount on ticket price and let them know there is discount
export const discount = (current, origional) => {
  var discount = origional - current;

  if (discount > 0) {
    return origional + " Birr";
  } else {
    return discount;
  }
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
export const formattedDate = (date) => {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
