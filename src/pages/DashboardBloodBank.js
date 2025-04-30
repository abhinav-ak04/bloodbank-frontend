import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BloodBankHeader from '../components/BloodBankHeader';
import BloodInventory from '../components/BloodInventory';
import BloodRequests from '../components/BloodRequests';
import ExternalData from '../components/ExternalData';
import LocationInfo from '../components/LocationInfo';
import StatsCards from '../components/StatsCards';

function DashboardBloodBank() {
  const { currentUser, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize bloodStock dynamically from currentUser
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const initialBloodStock = bloodGroups.map((group) => ({
    bloodType: group,
    units: currentUser?.bloodStock?.[group] || 0,
    lastUpdated: currentUser?.bloodStock?.[group] ? new Date().toLocaleString() : 'N/A',
  }));
  const [bloodStock, setBloodStock] = useState(initialBloodStock);

  // Initialize location dynamically from currentUser
  const [location] = useState({
    name: currentUser?.name || 'Central Blood Bank',
    address: currentUser?.address || '123 Medical Center Drive, Healthcare District',
    coordinates: {
      lat: currentUser?.location?.coordinates?.lat || '34.0522',
      lng: currentUser?.location?.coordinates?.lng || '-118.2437',
    },
  });

  const [requests] = useState([
    {
      id: 'REQ001',
      bloodType: 'A+',
      units: 2,
      hospital: 'City General Hospital',
      urgency: 'Urgent',
      status: 'Pending',
      requestedAt: '2024-03-15 08:45',
    },
    {
      id: 'REQ002',
      bloodType: 'O-',
      units: 3,
      hospital: 'Memorial Hospital',
      urgency: 'Critical',
      status: 'Approved',
      requestedAt: '2024-03-15 09:15',
    },
    {
      id: 'REQ003',
      bloodType: 'B+',
      units: 1,
      hospital: "St. Mary's Medical Center",
      urgency: 'Normal',
      status: 'Completed',
      requestedAt: '2024-03-15 07:30',
    },
  ]);

  const handleStockChange = async (index, change) => {
    setLoading(true);
    setError('');
    const newStock = [...bloodStock];
    newStock[index] = {
      ...newStock[index],
      units: Math.max(0, newStock[index].units + change),
      lastUpdated: new Date().toLocaleString(),
    };
    setBloodStock(newStock);

    // Prepare updated bloodStock for profile
    const updatedBloodStock = newStock.reduce((acc, stock) => {
      acc[stock.bloodType] = stock.units;
      return acc;
    }, {});

    try {
      await updateProfile({ bloodStock: updatedBloodStock });
    } catch (err) {
      setError('Failed to update blood stock. Please try again.');
      setBloodStock(initialBloodStock); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (newLocation) => {
    setLoading(true);
    setError('');
    try {
      await updateProfile({
        name: newLocation.name,
        address: newLocation.address,
        location: { coordinates: newLocation.coordinates },
      });
    } catch (err) {
      setError('Failed to update location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'Urgent':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Approved':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-orange-600 bg-orange-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BloodBankHeader location={location} />
      <main className="container mx-auto py-8 px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        )}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`flex-1 px-6 py-4 text-center font-semibold ${
                activeTab === 'inventory'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('inventory')}
            >
              Blood Inventory
            </button>
            <button
              className={`flex-1 px-6 py-4 text-center font-semibold ${
                activeTab === 'requests'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Blood Requests
            </button>
            <button
              className={`flex-1 px-6 py-4 text-center font-semibold ${
                activeTab === 'external'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('external')}
            >
              External Data
            </button>
          </div>

          {activeTab === 'inventory' ? (
            <BloodInventory bloodStock={bloodStock} handleStockChange={handleStockChange} />
          ) : activeTab === 'requests' ? (
            <BloodRequests requests={requests} getUrgencyColor={getUrgencyColor} getStatusColor={getStatusColor} />
          ) : (
            <ExternalData />
          )}
        </div>

        <LocationInfo location={location} updateLocation={updateLocation} />
        <StatsCards bloodStock={bloodStock} requests={requests} />
      </main>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default DashboardBloodBank;