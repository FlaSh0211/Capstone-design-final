import { handleActions, createAction } from "redux-actions";
import { Map, List } from "immutable";
import * as MylistAPI from "lib/api/myList";
import { pender } from "redux-pender";
import socketIOClient from "socket.io-client";
const SET_SOCKET = "socket/SET_SOCKET";
const REMOVE_SOCKET = "socket/REMOVE_SOCKET";

const SET_DRIVER_LIST = "socket/SET_DRIVER_LIST"; // list 정보 설정 [api 서버에 요청해서 받아옴]
const SET_DRIVER_INFO = "socket/SET_DRIVER_INFO"; // Driver 정보 설정 [socket으로부터 받아옴]
const SET_DRIVER_STATUS = "socket/set_DRIVER_STATUS"; // Driver active 상태 설정 [socket 사용]
const SET_DRIVER_CURRENT_LOC = "socket/SET_DRIVER_CURRENT_LOC"; // Driver 현재위치값 설정 [socket 사용]

export const setSocket = createAction(SET_SOCKET); // socket
export const removeSocket = createAction(REMOVE_SOCKET);

export const setDriverList = createAction(
  SET_DRIVER_LIST,
  MylistAPI.getDrivers
); // API
export const setDriverInfo = createAction(SET_DRIVER_INFO); // validated
export const setDriverStatus = createAction(SET_DRIVER_STATUS); // {driver, active}
export const setDriverCurrentLoc = createAction(SET_DRIVER_CURRENT_LOC);

const initialState = Map({
  socket: {},
  myList: Map({
    driverList: List([]),
  }),
});

export default handleActions(
  {
    [SET_SOCKET]: (state, action) => {
      const endpoint = "https://where-car.run.goorm.io";
      const socket = socketIOClient(endpoint);
      return state.set("socket", { socket });
    },
    [REMOVE_SOCKET]: (state, action) => {
      return state.set("socket", {});
    },
    [SET_DRIVER_STATUS]: (state, action) => {
      const { driver, active } = action.payload;
      const prev = state.getIn(["myList", "driverList"]).toJS();
      const after = prev.map((list) => {
        if (list.driverName === driver.driverName) {
          list.active = active;
        }
        return list;
      });
      return state.setIn(["myList", "driverList"], List(after));
    },
    ...pender({
      type: SET_DRIVER_LIST,
      onSuccess: (state, action) => {
        console.log("SET_DRIVER_LIST::: ", action.payload.data.driverList);
        return state.setIn(
          ["myList", "driverList"],
          List(action.payload.data.driverList)
        );
      },
    }),
  },
  initialState
);
