import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const signup = (data) => {
  return api.post('/auth/signup', data);
};

// OTP Functions
export const sendOTP = (email) => {
  return api.post('/auth/send-otp', { email });
};

export const verifyOTP = (email, otp) => {
  return api.post('/auth/verify-otp', { email, otp });
};

export const signupWithOTP = (data) => {
  return api.post('/auth/signup-verify', data);
};

export const loginWithOTP = (email, otp) => {
  return api.post('/auth/login-otp', { email, otp });
};

export const forgotPassword = (email) => {
  return Promise.resolve({ data: { message: 'Reset link sent' } });
};

export const resetPassword = (token, password) => {
  return Promise.resolve({ data: { message: 'Password reset successful' } });
};

export const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};
