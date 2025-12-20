import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './context/AuthContext';

// Auth Components
import ForgotPassword from './components/auth/ForgotPassword';
import LoginPage from './components/auth/LoginPage';
import VerifyOTPPage from './components/auth/VerifyOTPPage';

// App Components
import BookingFlow from './components/booking/BookingFlow';
import Navbar from './components/common/Navbar';
import HomePage from './components/home/HomePage';
import ProfilePage from './components/profile/ProfilePage';

/**
 * @intent Main app router with auth-based redirects and navigation
 */
function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />

      <main className="min-h-screen">
        <Routes>
          {/* Auth Routes - LoginPage now handles both login and signup */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/verify-otp"
            element={isAuthenticated ? <Navigate to="/" /> : <VerifyOTPPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/book"
            element={isAuthenticated ? <BookingFlow /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
