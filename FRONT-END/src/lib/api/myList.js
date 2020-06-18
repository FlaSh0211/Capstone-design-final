import axios from "axios";

// Backend에서 API를 만들어야 함.

export const getDrivers = () => axios.get(`/api/v1.0/mylist/drivers`);

// 자동차 관련
export const getCars = ({ id }) => axios.get(`/api/v1.0/admin/cars/` + id);
export const getCar = ({ id }) => axios.get(`/api/v1.0/admin/car/` + id);
export const deleteCar = ({ id }) => axios.delete(`/api/v1.0/admin/car/` + id);

// 코스 관련
export const getCourses = ({ id }) =>
  axios.get(`/api/v1.0/admin/courses/` + id);
export const getCourse = ({ id }) => axios.get(`/api/v1.0/admin/course/` + id);
export const deleteCourse = ({ id }) =>
  axios.delete(`/api/v1.0/admin/course/` + id);

export const activeCourse = ({ courseId, carId }) =>
  axios.post(`/api/v1.0/mylist/course/active/`, { courseId, carId });

// MyList 관련 groupPushRemove, coursePushRemove
export const getMyList = () => axios.get(`/api/v1.0/mylist`);
/* 즐겨찾기 부분 */
export const groupPushRemove = ({ groupId }) =>
  axios.post(`/api/v1.0/mylist/groupPushRemove`, { groupId });
export const coursePushRemove = ({ groupId, courseId }) =>
  axios.post(`/api/v1.0/mylist/coursePushRemove`, { groupId, courseId });

// 그룹에 가입
export const groupRegister = ({ groupId }) =>
  axios.post(`/api/v1.0/auth/register/group`, { groupId });
