import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Custom icon components using SVG (unchanged)
const Icons = {
    Droplet: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
    ),
    Heart: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    ),
    Calendar: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    MapPin: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    Alert: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
    Check: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    Clock: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
};

// BloodBankList Component (unchanged)
const BloodBankList = ({ latitude, longitude, bloodGroup }) => {
    const [bloodBanks, setBloodBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBloodBanks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/blood-banks`,
                    {
                        params: {
                            lat: latitude,
                            lng: longitude,
                            radius: 10,
                            bloodGroup,
                        },
                        withCredentials: true,
                    }
                );
                setBloodBanks(response.data.data || []);
            } catch (err) {
                setError(
                    'Failed to fetch blood banks. Please try again later.'
                );
                console.error('Error fetching blood banks:', err);
            } finally {
                setLoading(false);
            }
        };

        if (latitude && longitude && bloodGroup) fetchBloodBanks();
    }, [latitude, longitude, bloodGroup]);

    if (loading) {
        return (
            <div className="text-center py-4">
                <span className="animate-spin inline-block mr-2">
                    <Icons.Clock />
                </span>
                Loading blood banks...
            </div>
        );
    }

    if (error)
        return <div className="text-red-600 text-center py-4">{error}</div>;

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {bloodBanks.length === 0 ? (
                <p className="text-gray-500 text-center">
                    No blood banks found nearby with {bloodGroup} in stock
                </p>
            ) : (
                bloodBanks.map((bank) => (
                    <div
                        key={bank._id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                        <h3 className="font-medium text-gray-800">
                            {bank.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Icons.MapPin className="h-4 w-4 mr-1" />
                            {bank.address}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Stock ({bloodGroup}): {bank.bloodStock[bloodGroup]}{' '}
                            units
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Price: Rs {bank.pricePerUnit}/unit
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Contact: {bank.contactNumber}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

const DashboardPage = () => {
    const { currentUser, updateUserData } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [userStats, setUserStats] = useState({
        availableUnits: currentUser?.availableUnits || 0,
        bloodGroup: currentUser?.bloodGroup || 'O+',
    });
    const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error('Error getting location:', error);
                setUserLocation({ lat: 40.7128, lng: -74.006 }); // Default to New York
            }
        );
    }, []);

    useEffect(() => {
        if (currentUser) {
            setUserStats({
                availableUnits: currentUser.availableUnits || 0,
                bloodGroup: currentUser.bloodGroup || 'O+',
            });
        }
    }, [currentUser]);

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => setShowNotification(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    const compatibilityInfo = {
        'A+': {
            canDonateTo: ['A+', 'AB+'],
            canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
        },
        'A-': {
            canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
            canReceiveFrom: ['A-', 'O-'],
        },
        'B+': {
            canDonateTo: ['B+', 'AB+'],
            canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
        },
        'B-': {
            canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
            canReceiveFrom: ['B-', 'O-'],
        },
        'AB+': {
            canDonateTo: ['AB+'],
            canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        'AB-': {
            canDonateTo: ['AB+', 'AB-'],
            canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
        },
        'O+': {
            canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
            canReceiveFrom: ['O+', 'O-'],
        },
        'O-': {
            canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            canReceiveFrom: ['O-'],
        },
    };

    const canDonate = userStats.availableUnits > 0;

    const getDonationMessage = () => {
        if (!canDonate)
            return {
                message: 'You have no blood units available',
                type: 'error',
            };
        return {
            message:
                "You're eligible to donate now (although 3 months gap is advised)!",
            type: 'success',
        };
    };

    const donationStatus = getDonationMessage();

    const handleDonation = async () => {
        if (!canDonate) {
            setShowNotification(true);
            return;
        }

        setLoading(true);
        try {
            const currentDate = new Date().toISOString();
            const newDonation = { date: currentDate };
            const updatedUser = {
                ...currentUser,
                availableUnits: Math.max(0, userStats.availableUnits - 1),
                lastDonationDate: currentDate,
                donationHistory: [
                    ...(currentUser.donationHistory || []),
                    newDonation,
                ],
            };

            // Persist the updated user data to the backend
            await updateUserData(updatedUser);

            // Update local state
            setUserStats((prev) => ({
                ...prev,
                availableUnits: Math.max(0, prev.availableUnits - 1),
            }));
            setShowNotification(true);
        } catch (error) {
            console.error('Error updating donation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section (unchanged) */}
            <div className="relative bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/45-degree-fabric.png')] opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-red-700/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="w-72 h-72 bg-red-400/20 rounded-full absolute -top-36 -left-36 blur-3xl"></div>
                        <div className="w-96 h-96 bg-red-300/20 rounded-full absolute top-1/4 right-0 blur-3xl"></div>
                    </div>
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                            Welcome, {currentUser?.name || 'Donor'}!
                        </h2>
                        <p className="text-red-100 text-lg md:text-xl">
                            Every drop you donate creates ripples of hope.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-6">
                            <button
                                onClick={handleDonation}
                                disabled={!canDonate || loading}
                                className={`flex items-center px-6 py-2 rounded-lg transition transform hover:scale-105 ml-auto ${
                                    canDonate
                                        ? 'bg-white text-red-600 hover:bg-red-50'
                                        : 'bg-white/50 text-red-300 cursor-not-allowed'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin mr-2">
                                            <Icons.Clock />
                                        </span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">
                                            <Icons.Droplet />
                                        </span>
                                        I Donated Today
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Notification (unchanged) */}
            {showNotification && (
                <div className="fixed top-6 right-6 z-50 max-w-md animate-slide-in-right">
                    <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-start">
                        <div className="bg-white rounded-full p-1 mr-3">
                            <Icons.Check className="text-green-600 h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Thank You!</h3>
                            <p className="text-green-100">
                                {canDonate
                                    ? "Your donation has been recorded. You're helping save lives!"
                                    : 'You currently have no units available to donate.'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowNotification(false)}
                            className="ml-auto text-green-200 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Donation Status (unchanged) */}
            <div className="container mx-auto px-4 pt-6">
                <div
                    className={`rounded-lg shadow p-4 flex items-center ${
                        donationStatus.type === 'success'
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'bg-red-50 border-l-4 border-red-500'
                    }`}
                >
                    <div
                        className={`p-2 rounded-full mr-3 ${
                            donationStatus.type === 'success'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                        }`}
                    >
                        {donationStatus.type === 'success' ? (
                            <Icons.Check />
                        ) : (
                            <Icons.Alert />
                        )}
                    </div>
                    <div>
                        <p
                            className={`font-medium ${
                                donationStatus.type === 'success'
                                    ? 'text-green-800'
                                    : 'text-red-800'
                            }`}
                        >
                            {donationStatus.message}
                        </p>
                        <p className="text-sm opacity-80">
                            {donationStatus.type === 'success'
                                ? "You can donate whenever you're ready!"
                                : 'Please update your profile if you have blood units available.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Dashboard Content (unchanged) */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition group">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-lg text-red-600 group-hover:bg-red-200 transition">
                                <Icons.Droplet />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm font-medium">
                                    Blood Group
                                </h3>
                                <p className="text-2xl font-bold text-red-600">
                                    {userStats.bloodGroup}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Universal Recipient
                                </span>
                                <span className="font-medium">
                                    {userStats.bloodGroup === 'AB+'
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-500">
                                    Universal Donor
                                </span>
                                <span className="font-medium">
                                    {userStats.bloodGroup === 'O-'
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition group">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition">
                                <Icons.Heart />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm font-medium">
                                    Available Units
                                </h3>
                                <p className="text-2xl font-bold text-gray-800">
                                    {userStats.availableUnits}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Status
                                </span>
                                <span
                                    className={`font-medium ${
                                        userStats.availableUnits === 0
                                            ? 'text-red-500'
                                            : 'text-green-500'
                                    }`}
                                >
                                    {userStats.availableUnits === 0
                                        ? 'No units available'
                                        : 'Units available'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div
                                    className={`${
                                        userStats.availableUnits === 0
                                            ? 'bg-red-600'
                                            : 'bg-blue-600'
                                    } h-2.5 rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            userStats.availableUnits * 20,
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 hover:shadow-md transition">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <span className="h-5 w-5 mr-2 text-red-600">
                                    <Icons.Droplet />
                                </span>
                                Blood Compatibility
                            </h2>
                            {userStats.bloodGroup &&
                                compatibilityInfo[userStats.bloodGroup] && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                                            <h3 className="text-green-700 font-medium mb-2">
                                                Can Donate To
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {compatibilityInfo[
                                                    userStats.bloodGroup
                                                ].canDonateTo.map((group) => (
                                                    <span
                                                        key={group}
                                                        className="bg-white px-3 py-1 rounded-full text-green-600 border border-green-200 font-medium"
                                                    >
                                                        {group}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                            <h3 className="text-blue-700 font-medium mb-2">
                                                Can Receive From
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {compatibilityInfo[
                                                    userStats.bloodGroup
                                                ].canReceiveFrom.map(
                                                    (group) => (
                                                        <span
                                                            key={group}
                                                            className="bg-white px-3 py-1 rounded-full text-blue-600 border border-blue-200 font-medium"
                                                        >
                                                            {group}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
                                <h3 className="text-red-700 font-medium mb-2">
                                    Did you know?
                                </h3>
                                <p className="text-red-800 text-sm">
                                    {userStats.bloodGroup === 'O-'
                                        ? 'Your blood type (O-) is universal and can be given to anyone in an emergency.'
                                        : userStats.bloodGroup === 'AB+'
                                        ? 'Your blood type (AB+) means you can receive any type of blood donation.'
                                        : userStats.bloodGroup === 'O+'
                                        ? 'Your blood type (O+) is the most common, about 38% of the population has it.'
                                        : userStats.bloodGroup === 'A+'
                                        ? 'Your blood type (A+) is the second most common, found in about 34% of the population.'
                                        : 'Every 2 seconds, someone in the world needs blood. Your donations make a huge difference.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 hover:shadow-md transition">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <span className="h-5 w-5 mr-2 text-red-600">
                                    <Icons.MapPin />
                                </span>
                                Nearby Blood Banks
                            </h2>
                            <BloodBankList
                                latitude={userLocation.lat}
                                longitude={userLocation.lng}
                                bloodGroup={userStats.bloodGroup}
                            />
                            <button className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-md transition flex items-center justify-center">
                                <span className="mr-2">
                                    <Icons.MapPin />
                                </span>
                                View All Locations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
