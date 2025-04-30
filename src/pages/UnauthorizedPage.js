import React from 'react';
import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-700 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-center"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/" 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;