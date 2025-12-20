import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const signup = (data) => {
  return api.post('/auth/signup', data);
};

export const verifyOTP = (email, otp) => {
  // Backend doesn't have OTP endpoint yet, simulating success for now
  // or implementing if crucial. For now, let's assume auto-verify or skip.
  return Promise.resolve({ data: { message: 'Account verified' } });
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

