import React from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';

const BloodInventory = ({ bloodStock, handleStockChange }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bloodStock.map((stock, index) => (
          <div
            key={stock.bloodType}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Droplet
                  className={`h-5 w-5 ${
                    stock.units > 30 ? 'text-green-500' : stock.units > 10 ? 'text-orange-500' : 'text-red-500'
                  } mr-2`}
                />
                <span className="text-xl font-bold">{stock.bloodType}</span>
              </div>
              <span className="text-sm text-gray-500">Units Available</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleStockChange(index, -1)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-3xl font-bold text-gray-700">{stock.units}</span>
              <button
                onClick={() => handleStockChange(index, 1)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center">Last updated: {stock.lastUpdated}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodInventory;