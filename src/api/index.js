const Connection = {
  //url: "http://app.p2b-ethiopia.com/placetobe/",
  url: "http://192.168.100.3:8000/api/",
  signUp: "signup",
  signIn: "signin",
  googleSignUp: "continue-with-google",
  googleSignIn: "signin-with-google",
  profile: "profile/", // need closer look
  changeprofile: "changeprofile/", // need closer look
  userInfo: "user-info/",
  MetaData: "meta-info/",
  updateUserInfo: "update/",
  ChangePassword: "changepassword",

  //event related api's
  events: "events",
  eventDetails: "single-event/",
  moreEventDetails: "event-more-detail",
  AddEvent: "add-event",
  TodayEvents: "today-events",
  WeekEvents: "week-events",
  UpcomingEvents: "upcoming-events",
  categoryFilter: "search-category/",
  search: "search-event",
  YourEvents: "your-events/",

  follow: "follow",
  followers: "followers/",
  following: "following/",
  upload: "uploadimage.php",
  assets: "images/",

  //business api end points
  organizer: "organizer", //updated
  singleBusiness: "singleBusiness",

  notification: "notification",
  OrganizerFollowCounter: "organizer-followers/",
  organizerEvents: "organizer-event/",
  organizerUpcomings: "organizer-upcoming-event/",
  createfeedback: "create-feedback",
  forgotPassword: "forgotPassword",
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
  singleTicket: "single-ticket/",

  //refunding related api's
  requestRrefunding: "refunding-request",

  //rating end points
  addRating: "add-ratings",
  getRating: "get-ratings/",
  updateRating: "update-ratings/",

  //ads endpoints
  fetchAds: "display-ads",

  //viewed ads end points
  adViewed: "consumed-create",

  //tickets endpoints
  requestRefunding: "ticket-refunds",
  refundingInfo: "ticket-refunds/",
};

export default Connection;
