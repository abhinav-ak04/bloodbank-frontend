import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ProfilePageRecipient = () => {
  const { currentUser, updateProfile, deactivateAccount, loading: contextLoading, error: contextError } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bloodGroup: currentUser?.bloodGroup || '',
    location: {
      address: currentUser?.location?.address || '',
      city: currentUser?.location?.city || '',
      state: currentUser?.location?.state || '',
      zipCode: currentUser?.location?.zipCode || '',
    },
    medicalCondition: currentUser?.medicalCondition || '',
    urgencyLevel: currentUser?.urgencyLevel || 'normal',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [localLoading, setLocalLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLocalLoading(true);
      setMessage({ type: '', text: '' });
      await updateProfile(formData);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: contextError || 'Failed to update profile. Please try again.',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setLocalLoading(true);
      await deactivateAccount();
      // Redirect should be handled by parent component or routing logic after logout
    } catch (err) {
      setMessage({
        type: 'error',
        text: contextError || 'Failed to deactivate account. Please try again.',
      });
      setShowConfirmModal(false);
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = contextLoading || localLoading;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Recipient Profile</h1>
            <p className="mt-2 text-lg text-gray-600">
              Update your details to help us find the right blood donors for you
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
              <h2 className="text-xl font-semibold text-white">Recipient Details</h2>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 shadow-sm"
                      value={currentUser?.email || ''}
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group Needed
                    </label>
                    <div className="relative">
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition duration-200 shadow-sm bg-white"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your contact number"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                  Location Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="location.address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.location.address}
                      onChange={handleChange}
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="location.city"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.location.city}
                      onChange={handleChange}
                      required
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="location.state"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.location.state}
                      onChange={handleChange}
                      required
                      placeholder="Enter your state"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="location.zipCode"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.location.zipCode}
                      onChange={handleChange}
                      required
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                  Medical Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="medicalCondition"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Medical Condition (Optional)
                    </label>
                    <textarea
                      id="medicalCondition"
                      name="medicalCondition"
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-sm"
                      value={formData.medicalCondition}
                      onChange={handleChange}
                      placeholder="Briefly describe your medical condition"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      This helps us prioritize blood requests and find suitable donors
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="urgencyLevel" className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency Level
                    </label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="urgency-normal"
                          name="urgencyLevel"
                          value="normal"
                          checked={formData.urgencyLevel === 'normal'}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <label htmlFor="urgency-normal" className="ml-2 block text-sm text-gray-700">
                          Normal - Need blood within weeks
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="urgency-high"
                          name="urgencyLevel"
                          value="high"
                          checked={formData.urgencyLevel === 'high'}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <label htmlFor="urgency-high" className="ml-2 block text-sm text-gray-700">
                          High - Need blood within days
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="urgency-critical"
                          name="urgencyLevel"
                          value="critical"
                          checked={formData.urgencyLevel === 'critical'}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <label
                          htmlFor="urgency-critical"
                          className="ml-2 block text-sm text-red-700 font-medium"
                        >
                          Critical - Need blood immediately (within hours)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-red-600 hover:text-red-800 font-medium transition px-4 py-2 hover:bg-red-50 rounded-lg"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isLoading}
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Deactivate Account
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving Changes...
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
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-md w-full transform transition-all">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm Deactivation</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to deactivate your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition duration-200"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                onClick={handleDeactivate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Deactivate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePageRecipient;