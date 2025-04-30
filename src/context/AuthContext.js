import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  axios.defaults.baseURL = apiBaseUrl;

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const loadUser = useCallback(async () => {
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data && res.data.data) {
        const userData = res.data.data;
        const normalizedUser = {
          ...userData,
          role: userData.role || userData.userType || 'donor',
        };
        setUser(normalizedUser);
        setIsAuthenticated(true);
        localStorage.setItem('userRole', normalizedUser.role);
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (err) {
      console.error('Load user error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load user data');
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (formData) => {
    try {
      const userType = formData.userType || 'donor';
      const endpoint = `/auth/register${userType === 'donor' ? '' : `/${userType}`}`;
      const res = await axios.post(endpoint, formData);

      if (res.data && res.data.token && res.data.data) {
        const userData = res.data.data;
        const normalizedUser = {
          ...userData,
          role: userData.role || userType,
        };
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', normalizedUser.role);
        setToken(res.data.token);
        setUser(normalizedUser);
        setIsAuthenticated(true);
        setError(null);
        return res.data;
      }
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (email, password, userType = 'donor') => {
    try {
      const res = await axios.post('/auth/login', { email, password, userType });

      if (res.data && res.data.token && res.data.data) {
        const userData = res.data.data;
        const normalizedUser = {
          ...userData,
          role: userData.role || userType,
        };
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', normalizedUser.role);
        setToken(res.data.token);
        setUser(normalizedUser);
        setIsAuthenticated(true);
        setError(null);
        return res.data;
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

// AuthContext.js (updateProfile function only)
const updateProfile = async (profileData) => {
  if (!isAuthenticated || !user || !token) {
    setError('You must be logged in to update your profile');
    throw new Error('Not authenticated');
  }

  try {
    setLoading(true);
    const endpoint =
      user.role === 'donor'
        ? '/donors/profile'
        : user.role === 'recipient'
        ? '/recipients/profile'
        : user.role === 'bloodbank'
        ? '/blood-banks/profile'
        : null;

    if (!endpoint) throw new Error('Invalid user role');

    const res = await axios.put(endpoint, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.data && res.data.data) {
      const updatedUser = {
        ...user,
        ...res.data.data,
      };
      setUser(updatedUser);
      setError(null);
      return res.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (err) {
    console.error('Update profile error:', err.response?.data || err.message);
    const errorMessage = err.response?.data?.message || 'Failed to update profile';
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const updateUserData = async (updatedUserData) => {
    if (!isAuthenticated || !user || !token) {
      setError('You must be logged in to update user data');
      throw new Error('Not authenticated');
    }

    try {
      setLoading(true);
      const endpoint = '/donors/profile';
      
      // Do not include the ID in the request as it's handled by the auth middleware
      const res = await axios.put(endpoint, updatedUserData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data && res.data.data) {
        const updatedUser = { ...user, ...res.data.data };
        setUser(updatedUser);
        setError(null);
        return res.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Update user data error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to update user data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deactivateAccount = async () => {
    if (!isAuthenticated || !user || !token) {
      setError('You must be logged in to deactivate your account');
      throw new Error('Not authenticated');
    }

    try {
      setLoading(true);
      const endpoint = user.role === 'donor' ? '/donors/deactivate' :
                      user.role === 'recipient' ? '/recipients/deactivate' :
                      user.role === 'bloodbank' ? '/blood-banks/deactivate' : null;

      if (!endpoint) throw new Error('Invalid user role');

      const res = await axios.put(endpoint, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data && res.data.success) {
        logout();
        return res.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Deactivate account error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to deactivate account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = user;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        loadUser,
        updateProfile,
        updateUserData,
        deactivateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};