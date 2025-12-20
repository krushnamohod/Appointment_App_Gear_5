// Mock auth service - hardcoded credentials for testing
// Email: test@test.com | Password: Test@123

const MOCK_USER = {
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  phone: '1234567890'
};

const MOCK_TOKEN = 'mock-jwt-token-12345';

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com' && password === 'Test@123') {
        resolve({ data: { user: MOCK_USER, token: MOCK_TOKEN } });
      } else {
        reject({ response: { data: { message: 'Invalid email or password' } } });
      }
    }, 500);
  });
};

export const signup = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { message: 'OTP sent to email' } });
    }, 500);
  });
};

export const verifyOTP = (email, otp) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') {
        resolve({ data: { message: 'Account verified' } });
      } else {
        reject({ response: { data: { message: 'Invalid OTP' } } });
      }
    }, 500);
  });
};

export const forgotPassword = (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { message: 'Reset link sent' } });
    }, 500);
  });
};

export const resetPassword = (token, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { message: 'Password reset successful' } });
    }, 500);
  });
};

export const logout = () => Promise.resolve();

