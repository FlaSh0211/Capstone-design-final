import storage from "../lib/storage";

export const baseEmiter = (socket, mylist, driverLog) => {
  for (let i in mylist.groupList) {
    for (let k in mylist.groupList[i].courses) {
      socket.emit("joinRoom", { roomName: mylist.groupList[i].courses[k] });
      socket.emit("isDriverActive", {
        roomName: mylist.groupList[i].courses[k],
      });
      if (driverLog) {
        socket.emit("requestLocation", {
          roomName: mylist.groupList[i].courses[k],
          driverLogId: driverLog._id,
          name: driverLog.name,
        });
      }

      // console.log("testdddd", driverLog.name, driverLog._id);
    }
  }
};
export const baseListening = (socket, ListActions) => {
  socket.on("driverActive", ({ groupId, roomName }) => {
    console.log("드라이버 있음");
    console.log(roomName, groupId, ListActions);
    ListActions.activeUpdate({ groupId, courseId: roomName });
  });
  socket.on("driverDeActive", ({ groupId, roomName }) => {
    console.log("드라이버 있음");
    console.log(roomName, groupId, ListActions);
    ListActions.activeUpdate({ groupId, courseId: roomName });
  });
  socket.on(
    "sendLocation",
    ({ locationName, data, driverLog, distance, groupId }) => {
      console.log("driverLog:::::::::", driverLog);
      console.log(
        "locations:::::::::::::::::::",
        locationName,
        data,
        distance,
        groupId
      );
      // nextStation, distPer, groupId, courseId
      console.log("ListActions======", ListActions);
      ListActions.courseUpdate({
        nextStation: locationName,
        distPer: distance,
        groupId,
        courseId: data.roomName,
        data,
      });

      ListActions.getDriverLoc({ locData: data });
      if (driverLog) {
        storage.set("driverLog", driverLog);
      }
      // driverLog ? storage.set("driverLog", driverLog) : null;
    }
  );
};

function DriverListSoc(socket, ListActions, mylist) {}

export default DriverListSoc;
