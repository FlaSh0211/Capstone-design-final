import axios from "axios";

// Backend에서 API를 만들어야 함.

export const getManagers = () => axios.get(`/api/v1.0/admin/managers`);

export const updateManagers = ({ Users, Drivers }) =>
  axios.post(`/api/v1.0/admin/managers`, { Users, Drivers });

export const carRegister = ({
  carName,
  carNumber,
  seatNumber,
  inspectionDate,
  carImage,
}) =>
  axios.post(`/api/v1.0/admin/car/register`, {
    carName,
    carNumber,
    seatNumber,
    inspectionDate,
    carImage,
  });

export const courseRegister = ({ courseName, stations }) =>
  axios.post(`/api/v1.0/admin/course`, { courseName, stations });
export const courseUpdate = ({ courseId, stations, courseName }) =>
  axios.put(`/api/v1.0/admin/course`, { courseId, stations, courseName });
