import { createAction, handleActions } from "redux-actions";
import { pender } from "redux-pender";
import * as AuthAPI from "lib/api/auth";
import * as AdminAPI from "lib/api/admin";

import { Map, List } from "immutable";

/* ****************   input status checker **************** */
const CHANGE_INPUT = "auth/CHANGE_INPUT"; // input 값 변경
const INITIALIZE_FORM = "auth/INITIALIZE_FORM"; // form 초기화

/* ****************   email & id valid checker **************** */
const CHECK_EMAIL_EXISTS = "auth/CHECK_EMAIL_EXISTS"; // 이메일 중복 확인
const CHECK_DISPLAYNAME_EXISTS = "auth/CHECK_DISPLAYNAME_EXISTS"; // 아이디 중복 확인

/* ****************   Login & Logout checker **************** */
const LOCAL_REGISTER = "auth/LOCAL_REGISTER"; // 이메일 가입
const LOCAL_LOGIN = "auth/LOCAL_LOGIN"; // 이메일 로그인
const ADMIN_REGISTER = "auth/ADMIN_REGISTER"; // 관리자 계정 가입

const LOGOUT = "auth/LOGOUT"; // 로그아웃

/* ****************   Update UserDB **************** */
const UPDATE_USER = "auth/UPDATE_USER"; // 로그아웃

/* ****************   Error Setter **************** */
const SET_ERROR = "auth/SET_ERROR"; // 오류 설정

const CAR_REGISTER = "auth/CAR_REGISTER";
const COURSE_REGISTER = "auth/COURSE_REGISTER";
const COURSE_UPDATE = "auth/COURSE_UPDATE";

const SET_CAR = "auth/SET_CAR";

/* about input */
export const changeInput = createAction(CHANGE_INPUT); //  { form, name, value }
export const initializeForm = createAction(INITIALIZE_FORM); // form
/* checking */
export const checkEmailExists = createAction(
  CHECK_EMAIL_EXISTS,
  AuthAPI.checkEmailExists
); // email
export const checkDisplayNameExists = createAction(
  CHECK_DISPLAYNAME_EXISTS,
  AuthAPI.checkDisplayNameExists
); // displayName
/* Login & Register */
export const localRegister = createAction(
  LOCAL_REGISTER,
  AuthAPI.localRegister
); // { email, displayName, password, familyEmail }
export const localLogin = createAction(LOCAL_LOGIN, AuthAPI.localLogin); // { email, password }
// Todo socialLogin...

// Admin Register
export const adminRegister = createAction(
  ADMIN_REGISTER,
  AuthAPI.adminRegister
); // { type, name, tell, location, description, certification, role}

// Car Register
export const carRegister = createAction(CAR_REGISTER, AdminAPI.carRegister); // { type, name, tell, location, description, certification, role}
export const setCar = createAction(SET_CAR);

// Course Register
export const courseRegister = createAction(
  COURSE_REGISTER,
  AdminAPI.courseRegister
); // { courseName, stations}
export const courseUpdate = createAction(COURSE_UPDATE, AdminAPI.courseUpdate); // { courseName, stations}

/* Logout */
export const logout = createAction(LOGOUT, AuthAPI.logout);

export const updateUser = createAction(UPDATE_USER, AuthAPI.updateUser); // {email, displayName, password}
/* Error */
export const setError = createAction(SET_ERROR); // { form, message }

const initialState = Map({
  register: Map({
    form: Map({
      email: "",
      displayName: "",
      password: "",
      passwordConfirm: "",
      familyEmail: "",
    }),
    exists: Map({
      email: false,
      displayName: false,
      password: false,
    }),
    error: null,
  }),
  login: Map({
    form: Map({
      email: "",
      password: "",
    }),
    error: null,
  }),
  admin: Map({
    form: Map({
      type: "",
      name: "",
      tell: "",
      location: "",
      description: "",
    }),
    exists: Map({
      email: false,
      displayName: false,
      password: false,
    }),
    error: null,
  }),
  car: Map({
    form: Map({
      carName: "",
      carNumber: "",
      seatNumber: 2,
      inspectionDate: "",
    }),
    error: null,
  }),
  course: Map({
    form: Map({
      courseName: "",
    }),
    error: null,
  }),
  result: Map({}),
});

export default handleActions(
  {
    [CHANGE_INPUT]: (state, action) => {
      const { form, name, value } = action.payload;
      return state.setIn([form, "form", name], value);
    },
    [INITIALIZE_FORM]: (state, action) => {
      const initialForm = initialState.get(action.payload);
      return state.set(action.payload, initialForm);
    },
    [SET_CAR]: (state, action) => {
      const {
        carName,
        carNumber,
        seatNumber,
        inspectionDate,
      } = action.payload.car;
      console.log("333", carName);
      return state
        .setIn(["car", "form", "carName"], carName)
        .setIn(["car", "form", "carNumber"], carNumber)
        .setIn(["car", "form", "seatNumber"], seatNumber)
        .setIn(["car", "form", "inspectionDate"], inspectionDate);
    },
    ...pender({
      type: CHECK_EMAIL_EXISTS,
      onSuccess: (state, action) =>
        state.setIn(
          ["register", "exists", "email"],
          action.payload.data.exists
        ),
    }),
    ...pender({
      type: CHECK_DISPLAYNAME_EXISTS,
      onSuccess: (state, action) =>
        state.setIn(
          ["register", "exists", "displayName"],
          action.payload.data.exists
        ),
    }),
    ...pender({
      type: LOCAL_LOGIN,
      onSuccess: (state, action) =>
        state.set("result", Map(action.payload.data)),
    }),
    ...pender({
      type: LOCAL_REGISTER,
      onSuccess: (state, action) =>
        state.set("result", Map(action.payload.data)),
    }),
    ...pender({
      type: ADMIN_REGISTER,
      onSuccess: (state, action) =>
        state.set("result", Map(action.payload.data)),
    }),
    ...pender({
      type: UPDATE_USER,
      onSuccess: (state, action) =>
        state.set("result", Map(action.payload.data)),
    }),
    ...pender({
      type: COURSE_REGISTER,
      onSuccess: (state, action) =>
        state.set("result", Map(action.payload.data)),
    }),
    ...pender({
      type: COURSE_UPDATE,
      onSuccess: (state, action) =>
        state.set("result", Map(action.payload.data)),
    }),
    ...pender({
      type: CAR_REGISTER,
      onSuccess: (state, action) =>
        state.set("result", Map(action.payload.data)),
    }),
    [SET_ERROR]: (state, action) => {
      const { form, message } = action.payload;
      return state.setIn([form, "error"], message);
    },
  },
  initialState
);
