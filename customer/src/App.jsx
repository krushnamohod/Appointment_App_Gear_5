// ...existing code...
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './context/AuthContext';

import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import OTPVerification from './components/auth/OTPVerification';
import ForgotPassword from './components/auth/ForgotPassword';
import HomePage from './components/home/HomePage';
import BookingFlow from './components/booking/BookingFlow';


function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/book"
          element={isAuthenticated ? <BookingFlow /> : <Navigate to="/login" />}
        />

        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;