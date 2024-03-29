const Connection = {
  //url: "http://app.p2b-ethiopia.com/placetobe/",
  url: "http://192.168.100.3:8000/api/",
  signUp: "signup",
  signIn: "signin",
  googleSignUp: "signup-with-google",
  googleSignIn: "signin-with-google",
  profile: "profile/", // need closer look
  changeprofile: "changeprofile/", // need closer look
  userInfo: "user-info/",
  MetaData: "meta-info/",
  updateUserInfo: "update/",
  ChangePassword: "changepassword/",

  //event related api'sConnection
  events: "events",
  AddEvent: "add-event",
  TodayEvents: "today-events",
  WeekEvents: "week-events",
  UpcomingEvents: "upcoming-events",
  categoryFilter: "search-category/",
  search: "search-event/",
  YourEvents: "your-events/",

  follow: "follow",
  followers: "followers/",
  following: "following/",
  upload: "uploadimage.php",
  assets: "images/",
  organizer: "organizer", //updated

  notification: "fetchNotifications/",
  OrganizerFollowCounter: "organizer-followers/",
  organizerEvents: "organizer-event/",
  organizerUpcomings: "organizer-upcoming-event/",
  createfeedback: "create-feedback",
  forgotPassword: "forgotPassword", //*********** need pilot */
  status: "status", //*********** need pilot */
  Images: "Images",
  appInfo: "appinfo",

  // second version connnections
  AddTicket: "create-ticket",
  myTickets: "mytickets/",
  Soldout: "soldout/",
  EventPoster: "events-poster",
  UpdateTicket: "update-ticket/",
  updateEvent: "update-event/",
  Cancelled: "cancel-event/",
  eventTicket: "eventticket/",
  detailTicket: "event-detail-ticket/",
  Payment: "payment",
  Event: "single-event/", // a file to retrive single event by its event ID
  createReservation: "create-reservation",
  AvailableTickets: "tickets",
  FeaturedEvent: "featured-event",
  boughtTickets: "soldticket/",
};

export default Connection;
