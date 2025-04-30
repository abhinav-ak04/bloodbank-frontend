import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Chatbot from './components/Chatbot';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RecipientLoginPage from './pages/RecipientLoginPage';
import RecipientRegisterPage from './pages/RecipientRegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProfilePageRecipient from './pages/ProfilePageRecipient';
import ProfilePageBloodBank from './pages/ProfilePageBloodBank'; // Add this import
import DashboardPage from './pages/DashboardPage';
import BloodBanks from './pages/BloodBanks';
import RequestBlood from './pages/RequestBlood';
import DashboardRecipient from './pages/DashboardRecipient';
import DashboardBloodBank from './pages/DashboardBloodBank';
import BloodBankLogin from './pages/BloodBankLogin';
import RegisterPageBloodBank from './pages/RegisterPageBloodBank';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/LoadingSpinner';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Generic PrivateRoute (authentication only)
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// PrivateRouteWithRole (specific role required)
const PrivateRouteWithRole = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  const userRole = user?.role || user?.userType;
  if (role && userRole !== role) return <Navigate to="/unauthorized" />;
  
  return children;
};

// Dynamic Dashboard Route based on role
const DashboardRoute = () => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  
  const userRole = user?.role || user?.userType;
  switch (userRole) {
    case 'recipient':
      return <DashboardRecipient />;
    case 'bloodbank':
      return <DashboardBloodBank />;
    default:
      return <DashboardPage />;
  }
};

// Dynamic Profile Route based on role
const ProfileRoute = () => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  
  const userRole = user?.role || user?.userType;
  switch (userRole) {
    case 'recipient':
      return <ProfilePageRecipient />;
    case 'bloodbank':
      return <ProfilePageBloodBank />; // Updated to use ProfilePageBloodBank
    default:
      return <ProfilePage />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recipient-login" element={<RecipientLoginPage />} />
          <Route path="/recipient-register" element={<RecipientRegisterPage />} />
          <Route path="/bloodbank-login" element={<BloodBankLogin />} />
          <Route path="/bloodbank-register" element={<RegisterPageBloodBank />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfileRoute />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardRoute />
              </PrivateRoute>
            }
          />

          {/* Role-Specific Protected Routes */}
          <Route
            path="/recipient"
            element={
              <PrivateRouteWithRole role="recipient">
                <DashboardRecipient />
              </PrivateRouteWithRole>
            }
          />
          
          <Route
            path="/request"
            element={
              <PrivateRouteWithRole role="recipient">
                <RequestBlood />
              </PrivateRouteWithRole>
            }
          />
          
          <Route
            path="/blood-bank-results"
            element={
              <PrivateRouteWithRole role="recipient">
                <BloodBanks />
              </PrivateRouteWithRole>
            }
          />
          
          <Route
            path="/bloodbank"
            element={
              <PrivateRouteWithRole role="bloodbank">
                <DashboardBloodBank />
              </PrivateRouteWithRole>
            }
          />

          {/* Error and Fallback Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;