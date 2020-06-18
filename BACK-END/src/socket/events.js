const events = {
  driverActive: "driverActive", // Driver가 활성정보를 받음
  isDriverActive: "isDriverActive", //user가 서버로 driver의 상태를 물어봄
  findDriver: "findDriver", // 모든 사용자에게 운전자인지 묻는 요청
  findedDriver: "findedDriver", // 운전자일때만 발생하는 이벤트

  driverLogSave: "driverLogSave",

  sendNotifDriverActive: "sendNotifDriverActive", // Driver의 활성상태를 유저들에게 알림

  reciveLocation: "reciveLocation", // Driver로 부터 전송된 위치좌표
  sendLocation: "sendLocation", // Server로부터 전송되는 Driver의 위치좌표
  sendArriveTime: "sendArriveTime", // Server로부터 전송되는 Driver가 지정된 위치에 도착까지 걸리는 시간
  receiveGPS: "receiveGPS",
  receiveNotification: "receiveNotification", // Server로부터 받는 Notification
  sendNotification: "sendNotification", // Server로부터 전송되는 Notification

  joinRoom: "joinRoom", // 방에 입장하기 위한 이벤트
  leaveRoom: "leaveRoom",
  requestLocation: "requestLocation",
  requestLocationToDriver: "requestLocationToDriver", //드라이버에게 위치요청
  courseActive: "courseActive",
  notifiCourseActive: "notifiCourseActive",
};

module.exports = events;
