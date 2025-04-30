import React from 'react';

function Filters({
  radius,
  maxTravelTime,
  maxPrice,
  setRadius,
  setMaxTravelTime,
  setMaxPrice,
  handleClearFilters,
  handleFilterSubmit,
}) {
  return (
    <div className="bg-white p-4 md:w-64 shadow-md md:min-h-screen">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Distance (km): {radius}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Travel Time (min): {maxTravelTime}
        </label>
        <input
          type="range"
          min="5"
          max="180"
          step="5"
          value={maxTravelTime}
          onChange={(e) => setMaxTravelTime(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Price (₹): {maxPrice}
        </label>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleFilterSubmit}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default Filters;