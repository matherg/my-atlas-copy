export interface IMindfulSession {
  _id: String;
  userID: String;
  startDate: Date;
  duration: Number;
}

export interface IMindfulSessionDTO {
  userID: String;
  startDate: Date;
  duration: Number;
}