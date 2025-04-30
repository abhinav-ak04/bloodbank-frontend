import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRouteWithRole = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check all possible role properties for maximum compatibility
  const userRole = user?.role || user?.userType;
  
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default PrivateRouteWithRole;