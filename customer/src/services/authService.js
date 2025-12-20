import api from './api';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const signup = (data) =>
  api.post('/auth/signup', data);

export const verifyOTP = (email, otp) =>
  api.post('/auth/verify-otp', { email, otp });

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password });

export const logout = () => api.post('/auth/logout');
