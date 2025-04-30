import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../ui/Filters';
import Results from '../ui/Results';

function BloodBanks() {
  const [searchParams] = useSearchParams();
  // Convert to number with parseFloat and provide default values (0)
  const lat = parseFloat(searchParams.get('lat')) || 0;
  const lng = parseFloat(searchParams.get('lng')) || 0;
  const bloodGroup = searchParams.get('bloodGroup') || '';

  const [radius, setRadius] = useState(10);
  const [maxTravelTime, setMaxTravelTime] = useState(100);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBloodBanks = useCallback(async () => {
    setLoading(true);
    setError('');
    
    // Only fetch if we have valid coordinates
    if (lat === 0 && lng === 0) {
      setBloodBanks([]);
      setLoading(false);
      return;
    }
    
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: radius.toString(),
        maxTravelTime: maxTravelTime.toString(),
        maxPrice: maxPrice.toString(),
        bloodGroup: bloodGroup || 'A+', // Provide default if empty
      });
      
      const response = await fetch(`http://localhost:5000/api/blood-banks?${params}`);
      
      if (!response.ok) throw new Error('Failed to fetch blood banks');
      
      const data = await response.json();
      
      // Log the raw response for debugging
      console.log('Raw API Response:', data);
      
      // Ensure each blood bank has required properties with valid defaults
      const sanitizedBloodBanks = (data.data || []).map(bank => ({
        ...bank,
        distance: bank.distance || 0,
        travelTime: bank.travelTime || 0,
        // Use pricePerUnit instead of price (matching the property name in the second file)
        price: bank.pricePerUnit || 0,
        // Add any other properties that might be missing
        name: bank.name || 'Unknown Blood Bank',
        address: bank.address || 'No address available',
        availability: bank.availability || false,
      }));
      
      setBloodBanks(sanitizedBloodBanks);
    } catch (err) {
      setError('Error fetching blood banks. Please try again.');
      console.error(err);
      setBloodBanks([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [lat, lng, radius, maxTravelTime, maxPrice, bloodGroup]);

  useEffect(() => {
    fetchBloodBanks();
  }, [fetchBloodBanks]);

  const handleClearFilters = () => {
    setRadius(10);
    setMaxTravelTime(100);
    setMaxPrice(2000);
    fetchBloodBanks();
  };

  const handleFilterSubmit = () => {
    fetchBloodBanks();
  };

  // Check if we have valid search parameters
  const hasValidParams = lat !== 0 || lng !== 0 || bloodGroup;

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      <Filters
        radius={radius}
        maxTravelTime={maxTravelTime}
        maxPrice={maxPrice}
        setRadius={setRadius}
        setMaxTravelTime={setMaxTravelTime}
        setMaxPrice={setMaxPrice}
        handleClearFilters={handleClearFilters}
        handleFilterSubmit={handleFilterSubmit}
      />
      <div className="flex-1 p-4">
        {!hasValidParams ? (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Find Blood Banks</h2>
            <p className="text-gray-600">
              Please use the "Request Blood" page to specify your location and blood type needed.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            <Results 
              loading={loading} 
              bloodBanks={bloodBanks} 
              coordinates={{ lat, lng }} 
            />
          </>
        )}
      </div>
    </div>
  );
}

export default BloodBanks;