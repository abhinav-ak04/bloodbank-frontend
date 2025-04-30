import React from 'react';
import { AlertCircle, Clock, Activity } from 'lucide-react';

const StatsCards = ({ bloodStock, requests }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <h2 className="text-lg font-semibold">Critical Levels</h2>
        </div>
        <div className="space-y-2">
          {bloodStock
            .filter((stock) => stock.units <= 10)
            .map((stock) => (
              <div key={stock.bloodType} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{stock.bloodType}</span>
                <span className="text-red-600 font-medium">{stock.units} units</span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-orange-600 mr-2" />
          <h2 className="text-lg font-semibold">Pending Requests</h2>
        </div>
        <div className="space-y-2">
          {requests
            .filter((req) => req.status === 'Pending')
            .map((request) => (
              <div key={request.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{request.bloodType}</span>
                <span className="text-orange-600 font-medium">{request.units} units</span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Activity className="h-5 w-5 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold">Today's Activity</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Requests</span>
            <span className="text-green-600 font-medium">{requests.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Completed</span>
            <span className="text-green-600 font-medium">
              {requests.filter((req) => req.status === 'Completed').length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Pending</span>
            <span className="text-orange-600 font-medium">
              {requests.filter((req) => req.status === 'Pending').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;