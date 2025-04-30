import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Blood group options
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function RequestBlood() {
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    bloodGroup: 'A+',
    address: '',
  });
  
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/recipient-login');
    }
  }, [isAuthenticated, navigate]);

  // Set user data when available
  useEffect(() => {
    if (currentUser) {
      setUserData(prev => ({
        ...prev,
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        bloodGroup: currentUser.bloodGroup || 'A+',
        address: currentUser.location?.address || '',
      }));
    }
  }, [currentUser]);

  // Get user's current position
  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  };

  // Fetch address from coordinates
  const fetchAddress = async () => {
    setIsFetching(true);
    setError('');
    
    try {
      const positionObj = await getPosition();
      
      const newPosition = {
        latitude: positionObj.coords.latitude,
        longitude: positionObj.coords.longitude,
      };
      
      setPosition(newPosition);
      
      try {
        // Call your geocoding service
        const response = await axios.get(`http://localhost:5000/api/geocoding`, {
          params: {
            lat: newPosition.latitude,
            lng: newPosition.longitude
          }
        });
        
        const addressObj = response.data;
        const formattedAddress = `${addressObj?.locality || ''}, ${addressObj?.city || ''} ${addressObj?.postcode || ''}, ${addressObj?.countryName || ''}`.trim();
        
        setUserData(prev => ({ ...prev, address: formattedAddress }));
      } catch (err) {
        console.error("Geocoding error:", err);
        // If geocoding fails, still update with coordinates
        setUserData(prev => ({ 
          ...prev, 
          address: `Lat: ${newPosition.latitude.toFixed(4)}, Lng: ${newPosition.longitude.toFixed(4)}` 
        }));
      }
    } catch (err) {
      setError(
        err.code === 1
          ? 'Location access denied. Please enable location permissions.'
          : 'Failed to fetch location. Please try again or enter manually.'
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userData.address) {
      setError('Please provide an address or fetch your location');
      return;
    }
    
    // Navigate to blood bank results with query params
    navigate(
      `/blood-bank-results?lat=${encodeURIComponent(position.latitude || '')}&lng=${encodeURIComponent(position.longitude || '')}&bloodGroup=${encodeURIComponent(userData.bloodGroup)}`
    );
  };

  // If not authenticated, render nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Blood</h1>
          <p className="text-gray-600">Fill in the details to find available blood banks</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              value={userData.name} 
              disabled 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700" 
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              value={userData.phone} 
              disabled 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700" 
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
            <div className="flex gap-2">
              <input
                id="address"
                name="address"
                type="text"
                value={userData.address}
                onChange={handleInputChange}
                disabled={isFetching}
                required
                placeholder="Enter address or fetch location"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                type="button"
                onClick={fetchAddress}
                disabled={isFetching}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {isFetching ? 'Fetching...' : 'Get Location'}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">Blood Group Needed</label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={userData.bloodGroup}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isFetching}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Request Blood Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestBlood;