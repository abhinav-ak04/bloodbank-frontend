import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPageBloodBank = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '', // Changed from 'phone' to match schema
    address: '', // Changed from nested location object to match schema
    location: {
      coordinates: { lat: '', lng: '' },
    },
    pricePerUnit: '',
    bloodStock: {
      'A+': "",
      'A-': "",
      'B+': "",
      'B-': "",
      'O+': "",
      'O-': "",
      'AB+': "",
      'AB-': "",
    },
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('bloodStock')) {
      const bloodGroup = name.split('.')[1];
      setFormData({
        ...formData,
        bloodStock: {
          ...formData.bloodStock,
          [bloodGroup]: parseInt(value) || 0,
        },
      });
    } else if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: {
              ...formData[parent][child],
              [subChild]: value,
            },
          },
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match',
      });
      return;
    }

    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid price per unit',
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Add userType and remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;
      const dataToSend = { ...registerData, userType: 'bloodbank' };

      await register(dataToSend);
      navigate('/bloodbank');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register as a Blood Bank</h1>
            <p className="mt-2 text-lg text-gray-600">Join our network to manage blood inventory and requests</p>
          </div>

          {/* Alert Messages */}
          {message.text && (
            <div
              className={`mb-6 px-6 py-4 rounded-lg shadow-sm ${
                message.type === 'success'
                  ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                  : 'bg-red-50 border-l-4 border-red-500 text-red-700'
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg mr-2">{message.type === 'success' ? '✓' : '⚠️'}</span>
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
              <h2 className="text-xl font-semibold text-white">Create Your Blood Bank Account</h2>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">
              {/* Basic Information Section */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Bank Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter blood bank name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="bloodbank@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.password}
                      onChange={handleChange}
                      minLength="6"
                      required
                      placeholder="Enter password (min. 6 characters)"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength="6"
                      required
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter 10-digit contact number"
                      pattern="\d{10}"
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                  Location Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter full address"
                    />
                  </div>

                  <div>
                    <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      id="lat"
                      name="location.coordinates.lat"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.location.coordinates.lat}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 34.0522"
                      step="any"
                    />
                  </div>

                  <div>
                    <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      id="lng"
                      name="location.coordinates.lng"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.location.coordinates.lng}
                      onChange={handleChange}
                      required
                      placeholder="e.g., -118.2437"
                      step="any"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Latitude and longitude are required for precise location mapping.
                </p>
              </div>

              {/* Inventory Section */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                  Inventory Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Unit (₹)
                    </label>
                    <input
                      type="number"
                      id="pricePerUnit"
                      name="pricePerUnit"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.pricePerUnit}
                      onChange={handleChange}
                      required
                      placeholder="Enter price per unit"
                      min="0"
                      step="1"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Initial Blood Stock (Units)</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    {Object.keys(formData.bloodStock).map((group) => (
                      <div key={group}>
                        <label htmlFor={`bloodStock.${group}`} className="block text-sm font-medium text-gray-700 mb-1">
                          {group}
                        </label>
                        <input
                          type="number"
                          id={`bloodStock.${group}`}
                          name={`bloodStock.${group}`}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                          value={formData.bloodStock[group]}
                          onChange={handleChange}
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                <div className="text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/bloodbank-login"
                    className="text-red-600 hover:text-red-800 hover:underline font-medium transition duration-200"
                  >
                    Login here
                  </Link>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-70 w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5a2 2 0 001 1.732V23h12v-2.268A2 2 0 0019 21z"
                        />
                      </svg>
                      Register Blood Bank
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPageBloodBank;