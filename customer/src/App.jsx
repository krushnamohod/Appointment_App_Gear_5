import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './context/AuthContext';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPassword from './components/auth/ForgotPassword';
import OTPVerification from './components/auth/OTPVerification';

/**
 * @intent Main app router with auth-based redirects
 */
function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route
          path="/forgot-password"
          element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/verify-otp"
          element={isAuthenticated ? <Navigate to="/" /> : <OTPVerification />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Welcome to Appointment App</h1>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-xl">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

