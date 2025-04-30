import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ActionButtons from '../ui/ActionButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import bloodImage from '../assets/blood-donation-dashboard.jpg';

function DashboardRecipient() {
    const { currentUser, isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                console.log('Not authenticated, redirecting to /recipient-login');
                navigate('/recipient-login');
                return;
            }

            const userRole = currentUser?.role || currentUser?.userType;
            if (userRole !== 'recipient') {
                console.log('User role is not recipient, redirecting to /unauthorized');
                navigate('/unauthorized');
                return;
            }
        }
    }, [loading, isAuthenticated, currentUser, navigate]);

    if (loading) {
        return <LoadingSpinner fullScreen={true} />;
    }

    if (!isAuthenticated || (currentUser?.role || currentUser?.userType) !== 'recipient') {
        return <LoadingSpinner fullScreen={true} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 py-5 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg md:flex-row">
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
                            Welcome, {currentUser?.name || 'Recipient'}
                        </h1>
                        {currentUser?.bloodGroup && (
                            <div className="mt-3">
                                <span className="rounded-full bg-red-100 px-4 py-2 text-lg font-semibold text-red-800">
                                    Blood Group: {currentUser.bloodGroup}
                                </span>
                            </div>
                        )}
                        <p className="mt-6 text-lg italic text-gray-600 sm:text-xl">
                            "In every drop, there's a story of kindness. You are not alone—this gift of life is a reminder that hope always finds its way."
                        </p>
                        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                            <ActionButtons to="/request" className="w-full sm:w-auto">
                                Request Blood
                            </ActionButtons>
                            <ActionButtons to="/blood-bank-results" className="w-full sm:w-auto">
                                Find Blood Banks
                            </ActionButtons>
                        </div>
                    </div>
                    <div className="flex-1 p-4">
                        <img
                            src={bloodImage}
                            alt="Blood donation illustration"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
                {currentUser?.urgencyLevel && (
                    <div className="mt-6 rounded-lg bg-red-100 p-4 text-center">
                        <h3 className="text-xl font-semibold text-red-800">
                            Your Status
                        </h3>
                        <p className="mt-2 text-lg">
                            Urgency Level: <span className="font-bold capitalize">{currentUser.urgencyLevel}</span>
                        </p>
                    </div>
                )}
                <div className="mt-8 rounded-lg bg-white p-6 shadow">
                    <h2 className="text-2xl font-bold text-gray-800">Your Recent Activity</h2>
                    <div className="mt-4 text-gray-600">
                        <p>No recent activity</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardRecipient;