import React from 'react';
import { Building2 } from 'lucide-react';

const BloodBankHeader = ({ location }) => {
  return (
    <nav className="bg-red-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold"></h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-red-700 rounded-lg">
            <span className="font-semibold">{location.name}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BloodBankHeader;