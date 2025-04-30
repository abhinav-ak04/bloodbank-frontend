import React, { useState } from 'react';

const LocationInfo = ({ location, updateLocation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: location.name || '',
    address: location.address || '',
    coordinates: {
      lat: location.coordinates.lat || '',
      lng: location.coordinates.lng || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('coordinates')) {
      const coord = name.split('.')[1];
      setFormData({
        ...formData,
        coordinates: { ...formData.coordinates, [coord]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLocation(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update location:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Information</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Bank Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                name="coordinates.lat"
                value={formData.coordinates.lat}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                step="any"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                name="coordinates.lng"
                value={formData.coordinates.lng}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                step="any"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p className="text-gray-700">
            <strong>Name:</strong> {location.name}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {location.address}
          </p>
          <p className="text-gray-700">
            <strong>Coordinates:</strong> Lat: {location.coordinates.lat}, Lng: {location.coordinates.lng}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Edit Location
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationInfo;