import axios from 'axios';

// Backend에서 API를 만들어야 함.
export const checkEmailExists = (email) => axios.get(`/api/v1.0/auth/exists/email/` + email);
export const checkDisplayNameExists = (displayName) => axios.get(`/api/v1.0/auth/exists/displayName/` + displayName);

export const localRegister = ({email, familyEmail, displayName, password}) => axios.post(`/api/v1.0/auth/register/local`, { email, familyEmail, displayName, password });
export const localLogin = ({email, password}) => axios.post(`/api/v1.0/auth/login/local`, { email, password });

export const checkStatus = () => axios.get(`/api/v1.0/auth/check`);
export const logout = () => axios.post(`/api/v1.0/auth/logout`);

export const updateUser = ({email, familyEmail, displayName, password}) => axios.post('/api/v1.0/auth/profile', { email, familyEmail, displayName, password });

export const adminRegister = ({data}) => axios.post(`/api/v1.0/auth/register/admin`, data)